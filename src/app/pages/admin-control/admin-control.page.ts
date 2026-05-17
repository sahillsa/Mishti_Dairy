import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-control-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './admin-control.page.html',
  styleUrl: './admin-control.page.scss',
})
export class AdminControlPage {
  readonly modules = [
    {
      title: 'Customers',
      detail: 'Customer profiles, addresses, subscriptions, and credit limits.',
      icon: 'people-outline',
      status: 'Planned',
    },
    {
      title: 'Payments',
      detail: 'Razorpay settlements, COD reconciliation, invoices, and refunds.',
      icon: 'card-outline',
      status: 'Planned',
    },
    {
      title: 'Delivery',
      detail: 'Routes, delivery partners, tracking company rules, and slot limits.',
      icon: 'car-outline',
      status: 'Planned',
    },
    {
      title: 'Promotions',
      detail: 'Coupons, bundles, festive offers, and loyalty campaigns.',
      icon: 'pricetag-outline',
      status: 'Planned',
    },
    {
      title: 'Reports',
      detail: 'Revenue charts, product movement, query aging, and stock warnings.',
      icon: 'bar-chart-outline',
      status: 'Planned',
    },
    {
      title: 'Settings',
      detail: 'Store hours, serviceable pincodes, taxes, delivery fees, and roles.',
      icon: 'options-outline',
      status: 'Planned',
    },
  ];
}
