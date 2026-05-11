import { Component, inject } from '@angular/core';

import { Product } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-products-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
})
export class ProductsPage {
  private readonly shopService = inject(ShopService);
  readonly products = this.shopService.products;
  readonly categories = ['All', ...Array.from(new Set(this.products.map((product) => product.category)))];
  searchTerm = '';
  selectedCategory = 'All';
  selectedProduct: Product | null = null;
  filteredProducts(): Product[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.products.filter((product) => {
      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesQuery =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }

  addToCart(product: Product): void {
    this.shopService.addToCart(product);
  }
}
