import { Component, inject } from '@angular/core';

import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-admin-queries-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './admin-queries.page.html',
  styleUrl: './admin-queries.page.scss',
})
export class AdminQueriesPage {
  private readonly shopService = inject(ShopService);
  readonly queries$ = this.shopService.queries$;
}
