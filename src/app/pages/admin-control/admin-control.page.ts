import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-admin-control-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './admin-control.page.html',
  styleUrl: './admin-control.page.scss',
})
export class AdminControlPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  activeTab: 'modules' | 'team' = 'team';
  showAddForm = false;
  admins: User[] = [];

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    mobile: ['', [Validators.required, Validators.minLength(10)]],
  });

  errorMessage = '';

  ngOnInit() {
    this.loadAdmins();
  }

  async loadAdmins() {
    this.admins = await this.authService.getAdmins();
  }

  async createSubadmin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = '';

    const loading = await this.loadingCtrl.create({
      message: 'Creating subadmin...',
      spinner: 'crescent'
    });
    await loading.present();

    const result = await this.authService.createAdmin({
      ...this.form.getRawValue(),
      address: 'Admin Office' // Default address for subadmins
    });
    
    await loading.dismiss();

    if (result) {
      const toast = await this.toastCtrl.create({
        message: 'Subadmin created successfully!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      this.form.reset();
      this.showAddForm = false;
      this.loadAdmins();
    } else {
      this.errorMessage = 'Failed to create subadmin. Email might already exist.';
    }
  }

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
