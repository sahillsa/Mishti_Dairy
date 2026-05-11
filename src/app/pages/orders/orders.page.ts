import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { Order } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './orders.page.html',
  styleUrl: './orders.page.scss',
})
export class OrdersPage {
  private readonly authService = inject(AuthService);
  private readonly shopService = inject(ShopService);
  readonly orders$ = this.shopService.orders$;

  myOrders(orders: Order[]): Order[] {
    const userId = this.authService.currentUser?.id;
    return orders.filter((order) => order.userId === userId);
  }
}
