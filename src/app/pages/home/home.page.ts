import { Component, inject } from '@angular/core';

import { CartItem, Product } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  readonly shopService = inject(ShopService);
  readonly products$ = this.shopService.products$;
  readonly cart$ = this.shopService.cart$;
  readonly bannerUrl$ = this.shopService.bannerUrl$;
  readonly stats = [
    { label: 'Dairy products', value: '12+' },
    { label: 'Morning slots', value: '4' },
    { label: 'Average rating', value: '4.8' },
  ];
  readonly promiseCards = [
    { icon: 'leaf-outline', label: 'Fresh milk', detail: 'Chilled batches every morning' },
    { icon: 'cube-outline', label: 'Live stock', detail: 'Inventory visible before checkout' },
    { icon: 'card-outline', label: 'Razorpay ready', detail: 'Demo payment flow included' },
  ];
  readonly banners = [
    { image: 'assets/banners/banner_milk.png', title: 'Farm Fresh Milk', subtitle: 'Delivered daily to your door', link: '/products', queryParams: { category: 'Milk' } },
    { image: 'assets/banners/banner_ghee.png', title: 'Pure Cow Ghee', subtitle: 'Rich, golden, and aromatic', link: '/products', queryParams: { category: 'Ghee' } },
    { image: 'assets/banners/banner_sweets.png', title: 'Festive Sweets', subtitle: 'New arrivals for the season', link: '/products', queryParams: { category: 'Sweets' } }
  ];

  readonly quickCategories = [
    { title: 'Milk', icon: 'water-outline' },
    { title: 'Curd', icon: 'snow-outline' },
    { title: 'Ghee', icon: 'flame-outline' },
    { title: 'Sweets', icon: 'rose-outline' },
    { title: 'Paneer', icon: 'cube-outline' },
  ];

  featuredProducts(products: Product[]): Product[] {
    return products.filter((product) => !this.shopService.isUnavailable(product)).slice(0, 4);
  }

  newLaunches(products: Product[]): Product[] {
    return products.slice(-6).reverse();
  }

  categoryNames(products: Product[]): string[] {
    return Array.from(new Set(products.map((product) => product.category))).slice(0, 6);
  }

  productsInCategory(products: Product[], category: string): number {
    return products.filter((product) => product.category === category).length;
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
