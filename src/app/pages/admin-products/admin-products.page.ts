import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Product } from '../../core/models';
import { ShopService } from '../../core/shop.service';

@Component({
  selector: 'app-admin-products-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './admin-products.page.html',
  styleUrl: './admin-products.page.scss',
})
export class AdminProductsPage implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  readonly shopService = inject(ShopService);
  readonly products$ = this.shopService.products$;
  readonly stockDrafts: Record<number, number> = {};
  private readonly subscriptions = new Subscription();

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['Milk', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(12)]],
    image: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80', [Validators.required]],
    price: [120, [Validators.required, Validators.min(1)]],
    unit: ['1 litre', [Validators.required]],
    tag: ['New batch', [Validators.required]],
    stock: [20, [Validators.required, Validators.min(0)]],
    rating: [4.7, [Validators.required, Validators.min(0), Validators.max(5)]],
  });

  ngOnInit(): void {
    this.subscriptions.add(
      this.products$.subscribe((products) => {
        products.forEach((product) => {
          if (this.stockDrafts[product.id] === undefined) {
            this.stockDrafts[product.id] = product.stock;
          }
        });
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addProduct(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const product = this.shopService.addProduct(this.form.getRawValue());
    this.stockDrafts[product.id] = product.stock;
    this.form.patchValue({
      name: '',
      description: '',
      price: 120,
      stock: 20,
      tag: 'New batch',
    });
  }

  saveStock(product: Product): void {
    this.shopService.updateProductStock(product.id, this.stockDrafts[product.id]);
  }

  toggleOutOfStock(product: Product, checked: boolean): void {
    this.shopService.toggleOutOfStock(product.id, checked);
  }
}
