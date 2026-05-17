import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user?.role === 'admin') {
          return true;
        }
        return user
          ? this.router.createUrlTree(['/home'])
          : this.router.createUrlTree(['/login']);
      })
    );
  }
}
