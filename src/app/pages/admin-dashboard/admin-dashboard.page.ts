import { Component, inject } from '@angular/core';

import { HelpQuery, Order, Product } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss',
})
export class AdminDashboardPage {
  private readonly shopService = inject(ShopService);
  readonly orders$ = this.shopService.orders$;
  readonly queries$ = this.shopService.queries$;
  readonly products$ = this.shopService.products$;

  readonly controlCards = [
    {
      title: 'Orders',
      subtitle: 'Status, customer detail, and order chat',
      icon: 'receipt-outline',
      link: '/admin/orders',
      color: 'success',
    },
    {
      title: 'Inventory',
      subtitle: 'Add products and update stock',
      icon: 'cube-outline',
      link: '/admin/products',
      color: 'tertiary',
    },
    {
      title: 'Queries',
      subtitle: 'Support inbox and customer chat',
      icon: 'chatbubble-ellipses-outline',
      link: '/admin/queries',
      color: 'warning',
    },
    {
      title: 'Control',
      subtitle: 'Future operations modules',
      icon: 'settings-outline',
      link: '/admin/control',
      color: 'medium',
    },
  ];

  revenue(orders: Order[]): number {
    return orders.reduce((total, order) => total + order.total, 0);
  }

  openQueries(queries: HelpQuery[]): number {
    return queries.filter((query) => query.status !== 'Closed' && query.status !== 'Resolved').length;
  }

  lowStock(products: Product[]): number {
    return products.filter((product) => product.stock <= 10 || product.isOutOfStock).length;
  }
}
