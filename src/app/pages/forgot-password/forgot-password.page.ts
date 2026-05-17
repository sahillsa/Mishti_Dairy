import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

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
  private readonly loadingCtrl = inject(LoadingController);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  message = '';
  isSuccess = false;
  async recover(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Sending link...',
      spinner: 'crescent'
    });
    await loading.present();

    this.isSuccess = await this.authService.forgotPassword(this.form.controls.email.value);
    
    await loading.dismiss();

    this.message = this.isSuccess
      ? 'A password reset link has been sent to your email.'
      : 'Failed to send reset link. Check the email and try again.';
  }
}
