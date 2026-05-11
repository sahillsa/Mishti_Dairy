import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { HelpQuery } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-help-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './help.page.html',
  styleUrl: './help.page.scss',
})
export class HelpPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly shopService = inject(ShopService);

  readonly queries$ = this.shopService.queries$;
  readonly form = this.formBuilder.nonNullable.group({
    subject: ['', [Validators.required, Validators.minLength(4)]],
    message: ['', [Validators.required, Validators.minLength(12)]],
  });

  submittedMessage = '';
  submitQuery(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.shopService.submitQuery(value.subject, value.message);
    this.form.reset();
    this.submittedMessage = 'Your query has been sent to the Mishti Farmer team.';
  }

  myQueries(queries: HelpQuery[]): HelpQuery[] {
    const userId = this.authService.currentUser?.id;
    return queries.filter((query) => query.userId === userId);
  }
}
