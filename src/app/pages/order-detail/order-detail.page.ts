import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { Order, OrderStatus } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-order-detail-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './order-detail.page.html',
  styleUrl: './order-detail.page.scss',
})
export class OrderDetailPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly shopService = inject(ShopService);
  private readonly subscriptions = new Subscription();
  private hydratedOrderId = '';

  readonly statuses: OrderStatus[] = ['Placed', 'Accepted', 'In review', 'Shipped', 'Delivered', 'Cancelled'];
  order: Order | null = null;
  canAccess = true;
  statusDraft: OrderStatus = 'Placed';
  trackingId = '';
  trackingCompany = '';
  chatMessage = '';

  get isAdmin(): boolean {
    return this.authService.currentUser?.role === 'admin';
  }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId') ?? '';
    this.subscriptions.add(
      this.shopService.orders$.subscribe((orders) => {
        const order = orders.find((candidate) => candidate.id === orderId) ?? null;
        this.order = order;
        this.canAccess = this.canView(order);
        if (order && this.hydratedOrderId !== order.id) {
          this.hydratedOrderId = order.id;
          this.statusDraft = order.status;
          this.trackingId = order.trackingId ?? '';
          this.trackingCompany = order.trackingCompany ?? '';
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  backLink(): string {
    return this.isAdmin ? '/admin/orders' : '/orders';
  }

  canView(order: Order | null): boolean {
    const user = this.authService.currentUser;

    if (!order || !user) {
      return false;
    }

    return user.role === 'admin' || order.userId === user.id;
  }

  statusColor(order: Order): string {
    if (order.status === 'Delivered') {
      return 'success';
    }

    if (order.status === 'Cancelled') {
      return 'danger';
    }

    if (order.status === 'Shipped') {
      return 'tertiary';
    }

    return 'warning';
  }

  updateStatus(): void {
    if (!this.order || !this.isAdmin) {
      return;
    }

    this.shopService.updateOrderStatus(this.order.id, this.statusDraft, this.trackingId, this.trackingCompany);
    this.hydratedOrderId = '';
  }

  sendMessage(): void {
    if (!this.order || !this.chatMessage.trim()) {
      return;
    }

    this.shopService.addOrderMessage(this.order.id, this.chatMessage);
    this.chatMessage = '';
  }
}
