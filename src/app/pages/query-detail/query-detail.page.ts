import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { HelpQuery, QueryStatus } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-query-detail-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './query-detail.page.html',
  styleUrl: './query-detail.page.scss',
})
export class QueryDetailPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly shopService = inject(ShopService);
  private readonly subscriptions = new Subscription();
  private hydratedQueryId = '';

  readonly statuses: QueryStatus[] = ['Open', 'In review', 'Waiting for user', 'Resolved', 'Closed'];
  query: HelpQuery | null = null;
  canAccess = true;
  statusDraft: QueryStatus = 'Open';
  chatMessage = '';

  get isAdmin(): boolean {
    return this.authService.currentUser?.role === 'admin';
  }

  isMyMessage(message: { authorRole: string }): boolean {
    return message.authorRole === (this.isAdmin ? 'admin' : 'user');
  }

  ngOnInit(): void {
    const queryId = this.route.snapshot.paramMap.get('queryId') ?? '';
    this.subscriptions.add(
      this.shopService.queries$.subscribe((queries) => {
        const query = queries.find((candidate) => candidate.id === queryId) ?? null;
        this.query = query;
        this.canAccess = this.canView(query);
        if (query && this.hydratedQueryId !== query.id) {
          this.hydratedQueryId = query.id;
          this.statusDraft = query.status;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  backLink(): string {
    return this.isAdmin ? '/admin/queries' : '/help';
  }

  canView(query: HelpQuery | null): boolean {
    const user = this.authService.currentUser;

    if (!query || !user) {
      return false;
    }

    return user.role === 'admin' || query.userId === user.id;
  }

  statusColor(query: HelpQuery): string {
    if (query.status === 'Resolved' || query.status === 'Closed') {
      return 'success';
    }

    if (query.status === 'Waiting for user') {
      return 'tertiary';
    }

    return 'warning';
  }

  updateStatus(): void {
    if (!this.query || !this.isAdmin) {
      return;
    }

    this.shopService.updateQueryStatus(this.query.id, this.statusDraft);
    this.hydratedQueryId = '';
  }

  sendMessage(): void {
    if (!this.query || !this.chatMessage.trim()) {
      return;
    }

    this.shopService.addQueryMessage(this.query.id, this.chatMessage);
    this.chatMessage = '';
  }
}
