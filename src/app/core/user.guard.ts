import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          });
        }

        if (user.role === 'user') {
          return true;
        }

        return this.router.createUrlTree(['/admin/dashboard']);
      })
    );
  }
}
