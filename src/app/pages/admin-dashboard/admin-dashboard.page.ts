import { Component, inject } from '@angular/core';

import { HelpQuery, Order } from '../../core/models';
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
  readonly products = this.shopService.products;
  revenue(orders: Order[]): number {
    return orders.reduce((total, order) => total + order.total, 0);
  }

  openQueries(queries: HelpQuery[]): number {
    return queries.filter((query) => query.status !== 'Closed').length;
  }
}
