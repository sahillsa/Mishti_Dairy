import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';

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

  readonly form = this.formBuilder.nonNullable.group({
    email: ['user@mishti.in', [Validators.required, Validators.email]],
    password: ['user123', [Validators.required]],
  });

  errorMessage = '';
  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    const didLogin = this.authService.login(email, password);

    if (!didLogin) {
      this.errorMessage = 'Invalid email or password.';
      return;
    }

    const user = this.authService.currentUser;
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const defaultUrl = user?.role === 'admin' ? '/admin/dashboard' : '/home';
    const canUseReturnUrl =
      Boolean(returnUrl) &&
      ((user?.role === 'admin' && returnUrl?.startsWith('/admin')) ||
        (user?.role === 'user' && !returnUrl?.startsWith('/admin')));

    void this.router.navigateByUrl(canUseReturnUrl ? returnUrl ?? defaultUrl : defaultUrl);
  }
}
