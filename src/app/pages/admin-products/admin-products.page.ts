import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Product } from '../../core/models';
import { ShopService } from '../../core/shop.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

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
  private readonly storage = inject(Storage);
  readonly products$ = this.shopService.products$;
  readonly stockDrafts: Record<number, number> = {};
  private readonly subscriptions = new Subscription();
  
  imageSlots: { url: string, file: File | null }[] = [ { url: '', file: null } ];
  isUploading = false;
  editingProduct: Product | null = null;

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['Milk', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(12)]],
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

  addImageSlot(): void {
    if (this.imageSlots.length < 5) {
      this.imageSlots.push({ url: '', file: null });
    }
  }

  removeImageSlot(index: number): void {
    this.imageSlots.splice(index, 1);
    if (this.imageSlots.length === 0) {
      this.addImageSlot();
    }
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageSlots[index].file = input.files[0];
      this.imageSlots[index].url = ''; // clear URL if file selected
    }
  }

  onUrlEntered(event: any, index: number): void {
    this.imageSlots[index].url = event.target.value;
    if (this.imageSlots[index].url) {
      this.imageSlots[index].file = null; // clear file if URL entered
    }
  }

  async addProduct(): Promise<void> {
    const hasAnyImage = this.imageSlots.some(slot => slot.file || slot.url);
    if (this.form.invalid && !hasAnyImage) {
      this.form.markAllAsTouched();
      return;
    }

    this.isUploading = true;
    const finalUrls: string[] = [];

    try {
      for (const slot of this.imageSlots) {
        if (slot.file) {
          const storageRef = ref(this.storage, `products/${Date.now()}_${slot.file.name}`);
          const snapshot = await uploadBytes(storageRef, slot.file);
          const url = await getDownloadURL(snapshot.ref);
          finalUrls.push(url);
        } else if (slot.url) {
          finalUrls.push(slot.url);
        }
      }

      if (finalUrls.length === 0) {
        finalUrls.push('https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80'); // fallback
      }

      const productDraft = {
        ...this.form.getRawValue(),
        image: finalUrls[0],
        images: finalUrls,
      };

      const product = this.shopService.addProduct(productDraft);
      this.stockDrafts[product.id] = product.stock;
      
      this.cancelEdit();
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      this.isUploading = false;
    }
  }

  startEditProduct(product: Product): void {
    this.editingProduct = product;
    this.form.patchValue({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      unit: product.unit,
      tag: product.tag || '',
      stock: product.stock,
      rating: product.rating || 4.7
    });

    if (product.images && product.images.length > 0) {
      this.imageSlots = product.images.map(url => ({ url, file: null }));
    } else if (product.image) {
      this.imageSlots = [{ url: product.image, file: null }];
    } else {
      this.imageSlots = [{ url: '', file: null }];
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.form.reset({
      name: '',
      category: 'Milk',
      description: '',
      price: 120,
      unit: '1 litre',
      tag: 'New batch',
      stock: 20,
      rating: 4.7
    });
    this.imageSlots = [{ url: '', file: null }];
  }

  async saveProductChanges(): Promise<void> {
    if (!this.editingProduct) return;

    const hasAnyImage = this.imageSlots.some(slot => slot.file || slot.url);
    if (this.form.invalid && !hasAnyImage) {
      this.form.markAllAsTouched();
      return;
    }

    this.isUploading = true;
    const finalUrls: string[] = [];

    try {
      for (const slot of this.imageSlots) {
        if (slot.file) {
          const storageRef = ref(this.storage, `products/${Date.now()}_${slot.file.name}`);
          const snapshot = await uploadBytes(storageRef, slot.file);
          const url = await getDownloadURL(snapshot.ref);
          finalUrls.push(url);
        } else if (slot.url) {
          finalUrls.push(slot.url);
        }
      }

      if (finalUrls.length === 0) {
        finalUrls.push('https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80'); // fallback
      }

      const productDraft = {
        ...this.form.getRawValue(),
        image: finalUrls[0],
        images: finalUrls,
      };

      const updated = this.shopService.updateProduct(this.editingProduct.id, productDraft);
      this.stockDrafts[updated.id] = updated.stock;
      
      this.cancelEdit();
    } catch (e) {
      console.error('Update failed', e);
    } finally {
      this.isUploading = false;
    }
  }

  saveStock(product: Product): void {
    this.shopService.updateProductStock(product.id, this.stockDrafts[product.id]);
  }

  toggleOutOfStock(product: Product, checked: boolean): void {
    this.shopService.toggleOutOfStock(product.id, checked);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.shopService.deleteProduct(product.id);
    }
  }

  getSlotPreview(slot: { url: string, file: File | null }): string {
    if (slot.file) {
      try {
        return URL.createObjectURL(slot.file);
      } catch (e) {
        return 'assets/placeholder.png';
      }
    }
    return slot.url || '';
  }
}
