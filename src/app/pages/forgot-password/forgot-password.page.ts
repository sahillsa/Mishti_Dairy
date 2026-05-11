import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
})
export class ForgotPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  message = '';
  isSuccess = false;
  recover(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSuccess = this.authService.forgotPassword(this.form.controls.email.value);
    this.message = this.isSuccess
      ? 'A demo reset link has been generated for this account.'
      : 'No account was found for this email.';
  }
}
