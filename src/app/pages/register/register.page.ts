import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingCtrl = inject(LoadingController);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    mobile: ['', [Validators.required, Validators.minLength(10)]],
    address: ['', [Validators.required, Validators.minLength(10)]],
  });

  errorMessage = '';
  async register(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating account...',
      spinner: 'crescent'
    });
    await loading.present();

    const user = await this.authService.register(this.form.getRawValue());
    
    await loading.dismiss();

    if (!user) {
      this.errorMessage = 'This email is already registered.';
      return;
    }

    void this.router.navigateByUrl('/home');
  }
}
