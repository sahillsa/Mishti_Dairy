import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-account-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './account.page.html',
  styleUrl: './account.page.scss',
})
export class AccountPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly user$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}
