import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { CheckoutDetails, Order } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-payment-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './payment.page.html',
  styleUrl: './payment.page.scss',
})
export class PaymentPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  readonly shopService = inject(ShopService);

  readonly cart$ = this.shopService.cart$;
  readonly deliverySlots = [
    'Today, 6:00 PM - 8:00 PM',
    'Tomorrow, 6:00 AM - 8:00 AM',
    'Tomorrow, 8:00 AM - 10:00 AM',
    'Tomorrow, 6:00 PM - 8:00 PM',
  ];
  readonly form = this.formBuilder.nonNullable.group({
    address: [this.authService.currentUser?.address ?? '', [Validators.required, Validators.minLength(10)]],
    mobile: [this.authService.currentUser?.mobile ?? '', [Validators.required, Validators.minLength(10)]],
    deliverySlot: [this.deliverySlots[1], [Validators.required]],
    paymentMethod: ['Razorpay' as CheckoutDetails['paymentMethod'], [Validators.required]],
  });

  placedOrder: Order | null = null;
  errorMessage = '';

  get savedAddresses(): string[] {
    const user = this.authService.currentUser;
    if (!user) return [];
    if (user.addresses && user.addresses.length > 0) {
      return user.addresses;
    }
    return user.address ? [user.address] : [];
  }

  selectSavedAddress(event: any): void {
    const address = event.detail.value;
    if (address) {
      this.form.patchValue({ address });
    }
  }

  placeOrder(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.placedOrder = this.shopService.placeOrder(this.form.getRawValue());
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Could not place this order.';
    }
  }
}
