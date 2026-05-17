import { Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { AuthService } from '../core/auth.service';
import { ShopService } from '../core/shop.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: false,
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
  private readonly authService = inject(AuthService);
  private readonly shopService = inject(ShopService);

  readonly user$ = this.authService.currentUser$;
  readonly cartCount$ = this.shopService.cart$.pipe(map((cart) => this.shopService.cartCount(cart)));
}
