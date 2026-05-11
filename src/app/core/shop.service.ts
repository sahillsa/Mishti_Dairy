import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PRODUCTS, SEEDED_ORDERS, SEEDED_QUERIES } from './mock-data';
import { AuthService } from './auth.service';
import { CartItem, CheckoutDetails, HelpQuery, Order, Product } from './models';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private readonly authService = inject(AuthService);
  private readonly ordersKey = 'mishti_farmer_orders';
  private readonly queriesKey = 'mishti_farmer_queries';
  private readonly cartSubject = new BehaviorSubject<CartItem[]>(this.readCart());
  private readonly ordersSubject = new BehaviorSubject<Order[]>(this.readJson<Order[]>(this.ordersKey, SEEDED_ORDERS));
  private readonly queriesSubject = new BehaviorSubject<HelpQuery[]>(
    this.readJson<HelpQuery[]>(this.queriesKey, SEEDED_QUERIES),
  );

  readonly products = PRODUCTS;
  readonly cart$ = this.cartSubject.asObservable();
  readonly orders$ = this.ordersSubject.asObservable();
  readonly queries$ = this.queriesSubject.asObservable();

  constructor() {
    this.authService.currentUser$.subscribe(() => {
      this.cartSubject.next(this.readCart());
    });
  }

  getProduct(productId: number): Product | undefined {
    return this.products.find((product) => product.id === productId);
  }

  addToCart(product: Product, quantity = 1): void {
    const cart = [...this.cartSubject.value];
    const existing = cart.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    this.saveCart(cart);
  }

  setQuantity(productId: number, quantity: number): void {
    const nextCart = this.cartSubject.value
      .map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    this.saveCart(nextCart);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  cartTotal(cart: CartItem[] = this.cartSubject.value): number {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  cartCount(cart: CartItem[] = this.cartSubject.value): number {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  placeOrder(details: CheckoutDetails): Order {
    const user = this.authService.currentUser;
    const cart = this.cartSubject.value;

    if (!user || cart.length === 0) {
      throw new Error('A logged-in user with cart items is required before placing an order.');
    }

    const order: Order = {
      id: `MF-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      email: user.email,
      mobile: details.mobile,
      address: details.address,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        unit: item.product.unit,
        quantity: item.quantity,
      })),
      total: this.cartTotal(cart),
      status: 'Placed',
      paymentStatus: details.paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
      paymentMethod: details.paymentMethod,
      deliverySlot: details.deliverySlot,
      date: new Date().toISOString(),
    };

    const orders = [order, ...this.ordersSubject.value];
    this.ordersSubject.next(orders);
    this.writeJson(this.ordersKey, orders);
    this.clearCart();

    return order;
  }

  submitQuery(subject: string, message: string): HelpQuery {
    const user = this.authService.currentUser;

    if (!user) {
      throw new Error('A logged-in user is required before submitting a help query.');
    }

    const query: HelpQuery = {
      id: `Q-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      subject,
      message,
      status: 'Open',
      date: new Date().toISOString(),
    };

    const queries = [query, ...this.queriesSubject.value];
    this.queriesSubject.next(queries);
    this.writeJson(this.queriesKey, queries);

    return query;
  }

  private saveCart(cart: CartItem[]): void {
    this.cartSubject.next(cart);
    this.writeJson(this.cartKey, cart);
  }

  private readCart(): CartItem[] {
    return this.readJson<CartItem[]>(this.cartKey, []);
  }

  private get cartKey(): string {
    const userId = this.authService.currentUser?.id ?? 'guest';
    return `mishti_farmer_cart_${userId}`;
  }

  private readJson<T>(key: string, fallback: T): T {
    try {
      const value = this.storage?.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private writeJson(key: string, value: unknown): void {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }

  private get storage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }
}
