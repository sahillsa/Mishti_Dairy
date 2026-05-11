import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../core/auth.service';
import { ShopService } from '../core/shop.service';

@Component({
  selector: 'app-page-header',
  standalone: false,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly shopService = inject(ShopService);
  private readonly router = inject(Router);

  @Input() title = 'Mishti Farmer';

  readonly user$ = this.authService.currentUser$;
  readonly cartCount$ = this.shopService.cart$.pipe(map((cart) => this.shopService.cartCount(cart)));

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}
