import { Component, inject } from '@angular/core';

import { CartItem } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
})
export class CartPage {
  readonly shopService = inject(ShopService);
  readonly cart$ = this.shopService.cart$;

  increase(item: CartItem): void {
    this.shopService.setQuantity(item.product.id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    this.shopService.setQuantity(item.product.id, item.quantity - 1);
  }

  remove(item: CartItem): void {
    this.shopService.setQuantity(item.product.id, 0);
  }
}
