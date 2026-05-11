import { Component, inject } from '@angular/core';

import { Product } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  private readonly shopService = inject(ShopService);
  readonly featuredProducts = this.shopService.products.slice(0, 3);
  readonly stats = [
    { label: 'Fresh SKUs', value: '12' },
    { label: 'Delivery slots', value: '4' },
    { label: 'Avg rating', value: '4.8' },
  ];
  addToCart(product: Product): void {
    this.shopService.addToCart(product);
  }
}
