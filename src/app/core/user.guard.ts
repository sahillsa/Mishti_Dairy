import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.authService.currentUser;

    if (!user) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    if (user.role === 'user') {
      return true;
    }

    return this.router.createUrlTree(['/admin/dashboard']);
  }
}
