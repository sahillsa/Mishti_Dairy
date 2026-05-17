import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { Order, Product } from '../../core/models';
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
  readonly products$ = this.shopService.products$;

  myOrders(orders: Order[]): Order[] {
    const userId = this.authService.currentUser?.id;
    return orders.filter((order) => order.userId === userId);
  }

  orderImage(order: Order, products: Product[]): string {
    if (!order.items || order.items.length === 0) return 'assets/placeholder.png';
    const firstItem = order.items[0];
    const product = products.find(p => p.id === firstItem.productId);
    return product ? (product.image || 'assets/placeholder.png') : 'assets/placeholder.png';
  }

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

  statusIcon(order: Order): string {
    if (order.status === 'Delivered') return 'checkmark-circle';
    if (order.status === 'Cancelled') return 'close-circle';
    if (order.status === 'Shipped') return 'cube';
    return 'time';
  }

  orderSummary(order: Order): string {
    if (!order.items || order.items.length === 0) return 'No items';
    const firstItem = order.items[0].name;
    const remaining = order.items.length - 1;
    if (remaining > 0) {
      return `${firstItem} + ${remaining} more item${remaining > 1 ? 's' : ''}`;
    }
    return firstItem;
  }
}
