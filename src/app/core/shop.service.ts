import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collection, collectionData, doc, docData, setDoc } from '@angular/fire/firestore';

import { AuthService } from './auth.service';
import { PRODUCTS, SEEDED_ORDERS, SEEDED_QUERIES } from './mock-data';
import {
  CartItem,
  CheckoutDetails,
  HelpQuery,
  Order,
  OrderStatus,
  Product,
  ProductDraft,
  QueryStatus,
  ThreadMessage,
} from './models';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private readonly authService = inject(AuthService);
  private readonly firestore = inject(Firestore);
  private readonly productsKey = 'mishti_farmer_products';
  private readonly ordersKey = 'mishti_farmer_orders';
  private readonly queriesKey = 'mishti_farmer_queries';

  private readonly productsSubject = new BehaviorSubject<Product[]>(
    this.readJson<Product[]>(this.productsKey, PRODUCTS),
  );
  private readonly cartSubject = new BehaviorSubject<CartItem[]>(this.readCart());
  private readonly ordersSubject = new BehaviorSubject<Order[]>(
    this.readJson<Order[]>(this.ordersKey, SEEDED_ORDERS),
  );
  private readonly queriesSubject = new BehaviorSubject<HelpQuery[]>(
    this.readJson<HelpQuery[]>(this.queriesKey, SEEDED_QUERIES),
  );

  readonly products$ = this.productsSubject.asObservable();
  readonly cart$ = this.cartSubject.asObservable();
  readonly orders$ = this.ordersSubject.asObservable();
  readonly queries$ = this.queriesSubject.asObservable();
  
  readonly bannerUrl$ = docData(doc(this.firestore, 'settings/home')).pipe(
    map((data: any) => data?.bannerUrl || 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=1200&q=80')
  );

  constructor() {
    this.authService.currentUser$.subscribe(() => {
      this.cartSubject.next(this.readCart());
    });

    collectionData(collection(this.firestore, 'products')).subscribe((data) => {
      if (data && data.length > 0) {
        this.productsSubject.next(data as Product[]);
      } else {
        PRODUCTS.forEach(p => setDoc(doc(this.firestore, 'products', p.id.toString()), p));
      }
    });

    collectionData(collection(this.firestore, 'orders')).subscribe((data) => {
      if (data && data.length > 0) {
        this.ordersSubject.next(data as Order[]);
      } else {
        SEEDED_ORDERS.forEach(o => setDoc(doc(this.firestore, 'orders', o.id.toString()), o));
      }
    });

    collectionData(collection(this.firestore, 'queries')).subscribe((data) => {
      if (data && data.length > 0) {
        this.queriesSubject.next(data as HelpQuery[]);
      } else {
        SEEDED_QUERIES.forEach(q => setDoc(doc(this.firestore, 'queries', q.id.toString()), q));
      }
    });
  }

  get products(): Product[] {
    return this.productsSubject.value;
  }

  getProduct(productId: number): Product | undefined {
    return this.products.find((product) => product.id === productId);
  }

  getOrder(orderId: string): Order | undefined {
    return this.ordersSubject.value.find((order) => order.id === orderId);
  }

  getQuery(queryId: string): HelpQuery | undefined {
    return this.queriesSubject.value.find((query) => query.id === queryId);
  }

  addToCart(product: Product, quantity = 1): boolean {
    const currentProduct = this.getProduct(product.id);

    if (!currentProduct || this.isUnavailable(currentProduct)) {
      return false;
    }

    const cart = [...this.cartSubject.value];
    const existing = cart.find((item) => item.product.id === currentProduct.id);
    const currentQuantity = existing?.quantity ?? 0;
    const nextQuantity = Math.min(currentQuantity + quantity, currentProduct.stock);

    if (nextQuantity <= currentQuantity) {
      return false;
    }

    if (existing) {
      existing.quantity = nextQuantity;
      existing.product = currentProduct;
    } else {
      cart.push({ product: currentProduct, quantity: nextQuantity });
    }

    this.saveCart(cart);
    return true;
  }

  setQuantity(productId: number, quantity: number): void {
    const product = this.getProduct(productId);
    const cappedQuantity = product && !this.isUnavailable(product) ? Math.min(quantity, product.stock) : 0;
    const nextCart = this.cartSubject.value
      .map((item) => (item.product.id === productId ? { ...item, product: product ?? item.product, quantity: cappedQuantity } : item))
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

  cartQuantity(productId: number, cart: CartItem[] = this.cartSubject.value): number {
    return cart.find((item) => item.product.id === productId)?.quantity ?? 0;
  }

  placeOrder(details: CheckoutDetails): Order {
    const user = this.authService.currentUser;
    const cart = this.cartSubject.value;

    if (!user || cart.length === 0) {
      throw new Error('A logged-in user with cart items is required before placing an order.');
    }

    const validatedCart = cart.map((item) => {
      const product = this.getProduct(item.product.id);
      if (!product || this.isUnavailable(product) || item.quantity > product.stock) {
        throw new Error(`${item.product.name} is no longer available in the requested quantity.`);
      }
      return { ...item, product };
    });

    const order: Order = {
      id: `MF-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      email: user.email,
      mobile: details.mobile,
      address: details.address,
      items: validatedCart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        unit: item.product.unit,
        quantity: item.quantity,
      })),
      total: this.cartTotal(validatedCart),
      status: 'Placed',
      paymentStatus: details.paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
      paymentMethod: details.paymentMethod,
      deliverySlot: details.deliverySlot,
      date: new Date().toISOString(),
      messages: [
        this.createMessage(
          user.role,
          user.name,
          `Order placed for ${validatedCart.length} product${validatedCart.length > 1 ? 's' : ''}.`,
        ),
      ],
    };

    const products = this.products.map((product) => {
      const orderedItem = validatedCart.find((item) => item.product.id === product.id);
      if (!orderedItem) {
        return product;
      }

      const stock = Math.max(0, product.stock - orderedItem.quantity);
      return { ...product, stock, isOutOfStock: product.isOutOfStock || stock === 0 };
    });

    const orders = [order, ...this.ordersSubject.value];
    this.persistProducts(products);
    this.ordersSubject.next(orders);
    this.writeJson(this.ordersKey, orders);
    setDoc(doc(this.firestore, 'orders', order.id.toString()), order).catch(console.error);
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
      messages: [this.createMessage(user.role, user.name, message)],
    };

    const queries = [query, ...this.queriesSubject.value];
    this.queriesSubject.next(queries);
    this.writeJson(this.queriesKey, queries);
    setDoc(doc(this.firestore, 'queries', query.id.toString()), query).catch(console.error);

    return query;
  }

  addProduct(draft: ProductDraft): Product {
    const product: Product = {
      ...draft,
      id: Date.now(),
      stock: Math.max(0, Math.round(Number(draft.stock) || 0)),
      price: Math.max(0, Math.round(Number(draft.price) || 0)),
      rating: Math.min(5, Math.max(0, Number(draft.rating) || 4.6)),
      isOutOfStock: Math.round(Number(draft.stock) || 0) <= 0,
    };

    this.persistProducts([product, ...this.products]);
    return product;
  }

  updateProductStock(productId: number, stock: number): void {
    const cleanStock = Math.max(0, Math.round(Number(stock) || 0));
    this.persistProducts(
      this.products.map((product) =>
        product.id === productId
          ? { ...product, stock: cleanStock, isOutOfStock: cleanStock === 0 ? true : product.isOutOfStock }
          : product,
      ),
    );
    this.reconcileCartWithStock(productId);
  }

  toggleOutOfStock(productId: number, isOutOfStock: boolean): void {
    this.persistProducts(
      this.products.map((product) => (product.id === productId ? { ...product, isOutOfStock } : product)),
    );
    this.reconcileCartWithStock(productId);
  }

  updateOrderStatus(orderId: string, status: OrderStatus, trackingId = '', trackingCompany = ''): void {
    const admin = this.authService.currentUser;
    const orders = this.ordersSubject.value.map((order) => {
      if (order.id !== orderId) {
        return order;
      }

      const trackingFields =
        status === 'Shipped'
          ? {
              trackingId: trackingId.trim(),
              trackingCompany: trackingCompany.trim(),
            }
          : {};

      return {
        ...order,
        status,
        ...trackingFields,
        messages: [
          ...order.messages,
          this.createMessage(
            admin?.role ?? 'admin',
            admin?.name ?? 'Mishti Admin',
            status === 'Shipped'
              ? `Order status changed to Shipped. Tracking: ${trackingCompany || 'Delivery partner'} ${trackingId || ''}`.trim()
              : `Order status changed to ${status}.`,
          ),
        ],
      };
    });

    this.ordersSubject.next(orders);
    this.writeJson(this.ordersKey, orders);
    const updatedOrder = orders.find(o => o.id === orderId);
    if (updatedOrder) setDoc(doc(this.firestore, 'orders', orderId.toString()), updatedOrder).catch(console.error);
  }

  addOrderMessage(orderId: string, message: string): void {
    const user = this.authService.currentUser;
    const cleanMessage = message.trim();

    if (!user || !cleanMessage) {
      return;
    }

    const orders = this.ordersSubject.value.map((order) =>
      order.id === orderId
        ? { ...order, messages: [...order.messages, this.createMessage(user.role, user.name, cleanMessage)] }
        : order,
    );

    this.ordersSubject.next(orders);
    this.writeJson(this.ordersKey, orders);
    const updatedOrder = orders.find(o => o.id === orderId);
    if (updatedOrder) setDoc(doc(this.firestore, 'orders', orderId.toString()), updatedOrder).catch(console.error);
  }

  updateQueryStatus(queryId: string, status: QueryStatus): void {
    const admin = this.authService.currentUser;
    const queries = this.queriesSubject.value.map((query) =>
      query.id === queryId
        ? {
            ...query,
            status,
            messages: [
              ...query.messages,
              this.createMessage(admin?.role ?? 'admin', admin?.name ?? 'Mishti Admin', `Query status changed to ${status}.`),
            ],
          }
        : query,
    );

    this.queriesSubject.next(queries);
    this.writeJson(this.queriesKey, queries);
    const updatedQuery = queries.find(q => q.id === queryId);
    if (updatedQuery) setDoc(doc(this.firestore, 'queries', queryId.toString()), updatedQuery).catch(console.error);
  }

  addQueryMessage(queryId: string, message: string): void {
    const user = this.authService.currentUser;
    const cleanMessage = message.trim();

    if (!user || !cleanMessage) {
      return;
    }

    const queries = this.queriesSubject.value.map((query) =>
      query.id === queryId
        ? { ...query, messages: [...query.messages, this.createMessage(user.role, user.name, cleanMessage)] }
        : query,
    );

    this.queriesSubject.next(queries);
    this.writeJson(this.queriesKey, queries);
    const updatedQuery = queries.find(q => q.id === queryId);
    if (updatedQuery) setDoc(doc(this.firestore, 'queries', queryId.toString()), updatedQuery).catch(console.error);
  }

  isUnavailable(product: Product): boolean {
    return product.isOutOfStock || product.stock <= 0;
  }

  private createMessage(authorRole: ThreadMessage['authorRole'], authorName: string, message: string): ThreadMessage {
    return {
      id: `MSG-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      authorRole,
      authorName,
      message,
      date: new Date().toISOString(),
    };
  }

  private reconcileCartWithStock(productId: number): void {
    const product = this.getProduct(productId);
    const cart = this.cartSubject.value
      .map((item) => {
        if (item.product.id !== productId || !product) {
          return item;
        }

        return {
          ...item,
          product,
          quantity: this.isUnavailable(product) ? 0 : Math.min(item.quantity, product.stock),
        };
      })
      .filter((item) => item.quantity > 0);

    this.saveCart(cart);
  }

  private persistProducts(products: Product[]): void {
    this.productsSubject.next(products);
    this.writeJson(this.productsKey, products);
    products.forEach(p => {
      setDoc(doc(this.firestore, 'products', p.id.toString()), p).catch(console.error);
    });
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
