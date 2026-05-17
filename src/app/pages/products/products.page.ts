import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CartItem, Product } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-products-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
})
export class ProductsPage implements OnInit {
  readonly shopService = inject(ShopService);
  private readonly route = inject(ActivatedRoute);
  readonly products$ = this.shopService.products$;
  readonly cart$ = this.shopService.cart$;

  searchTerm = '';
  selectedCategory = 'All';
  selectedProduct: Product | null = null;

  ngOnInit(): void {
    const category = this.route.snapshot.queryParamMap.get('category');
    if (category) {
      this.selectedCategory = category;
    }
  }

  categories(products: Product[]): string[] {
    return ['All', ...Array.from(new Set(products.map((product) => product.category)))];
  }

  filteredProducts(products: Product[]): Product[] {
    const query = this.searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesQuery =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }

  quantityInCart(productId: number, cart: CartItem[]): number {
    return this.shopService.cartQuantity(productId, cart);
  }

  addToCart(product: Product): void {
    this.shopService.addToCart(product);
  }

  increase(product: Product, cart: CartItem[]): void {
    this.shopService.setQuantity(product.id, this.quantityInCart(product.id, cart) + 1);
  }

  decrease(product: Product, cart: CartItem[]): void {
    this.shopService.setQuantity(product.id, this.quantityInCart(product.id, cart) - 1);
  }
}
