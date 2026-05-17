import { Component, inject } from '@angular/core';

import { Order } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-admin-orders-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './admin-orders.page.html',
  styleUrl: './admin-orders.page.scss',
})
export class AdminOrdersPage {
  private readonly shopService = inject(ShopService);
  readonly orders$ = this.shopService.orders$;

  statusColor(order: Order): string {
    if (order.status === 'Delivered') {
      return 'success';
    }

    if (order.status === 'Cancelled') {
      return 'danger';
    }

    if (order.status === 'Shipped') {
      return 'tertiary';
    }

    return 'warning';
  }
}
