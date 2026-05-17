import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthService } from '../../core/auth.service';

import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loadingCtrl = inject(LoadingController);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['user@mishti.in', [Validators.required, Validators.email]],
    password: ['user123', [Validators.required]],
  });

  errorMessage = '';
  async login(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'crescent'
    });
    await loading.present();

    const didLogin = await this.authService.login(email, password);

    if (!didLogin) {
      await loading.dismiss();
      this.errorMessage = 'Invalid email or password.';
      return;
    }

    // Wait for the user document to load from Firestore
    const user = await firstValueFrom(this.authService.currentUser$.pipe(filter(u => !!u)));
    await loading.dismiss();

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const defaultUrl = user?.role === 'admin' ? '/admin/dashboard' : '/home';
    const canUseReturnUrl =
      Boolean(returnUrl) &&
      ((user?.role === 'admin' && returnUrl?.startsWith('/admin')) ||
        (user?.role === 'user' && !returnUrl?.startsWith('/admin')));

    void this.router.navigateByUrl(canUseReturnUrl ? returnUrl ?? defaultUrl : defaultUrl);
  }
}
