import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (this.authService.isAdmin()) {
      return true;
    }

    return this.authService.isAuthenticated()
      ? this.router.createUrlTree(['/home'])
      : this.router.createUrlTree(['/login']);
  }
}
