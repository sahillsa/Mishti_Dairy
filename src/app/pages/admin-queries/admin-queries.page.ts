import { Component, inject } from '@angular/core';

import { HelpQuery } from '../../core/models';
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

  statusColor(query: HelpQuery): string {
    if (query.status === 'Resolved' || query.status === 'Closed') {
      return 'success';
    }

    if (query.status === 'Waiting for user') {
      return 'tertiary';
    }

    return 'warning';
  }
}
