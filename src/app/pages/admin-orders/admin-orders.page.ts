import { Component, inject } from '@angular/core';

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
}
