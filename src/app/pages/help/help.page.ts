import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  private readonly router = inject(Router);

  readonly queries$ = this.shopService.queries$;
  readonly form = this.formBuilder.nonNullable.group({
    subject: ['', [Validators.required, Validators.minLength(4)]],
    message: ['', [Validators.required, Validators.minLength(12)]],
  });

  submitQuery(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const query = this.shopService.submitQuery(value.subject, value.message);
    this.form.reset();
    void this.router.navigate(['/help', query.id]);
  }

  myQueries(queries: HelpQuery[]): HelpQuery[] {
    const userId = this.authService.currentUser?.id;
    return queries.filter((query) => query.userId === userId);
  }

  statusColor(query: HelpQuery): string {
    if (query.status === 'Resolved' || query.status === 'Closed') {
      return 'success';
    }

    if (query.status === 'Waiting for user') {
      return 'tertiary';
    }

    return 'warning';
  }

  statusIcon(query: HelpQuery): string {
    if (query.status === 'Resolved' || query.status === 'Closed') {
      return 'checkmark-circle-outline';
    }
    if (query.status === 'Waiting for user') {
      return 'mail-unread-outline';
    }
    if (query.status === 'In review') {
      return 'eye-outline';
    }
    return 'chatbubble-ellipses-outline';
  }
}
