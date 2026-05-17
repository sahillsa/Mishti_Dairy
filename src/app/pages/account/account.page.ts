import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { AuthService } from '../../core/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-account-page',
  standalone: false,
  host: { class: 'ion-page' },
  templateUrl: './account.page.html',
  styleUrl: './account.page.scss',
})
export class AccountPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);
  
  readonly user$ = this.authService.currentUser$;

  getAddresses(user: User): string[] {
    if (user.addresses && user.addresses.length > 0) {
      return user.addresses;
    }
    return user.address ? [user.address] : [];
  }

  async editName(user: User): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Edit Name',
      inputs: [{ name: 'name', type: 'text', value: user.name, placeholder: 'Your Name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Save', handler: async (data) => {
            if (data.name && data.name.trim() !== user.name) {
               await this.authService.updateProfile(String(user.id), { name: data.name.trim() });
               this.showToast('Name updated');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async addAddress(user: User): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Add Address',
      inputs: [{ name: 'address', type: 'textarea', placeholder: 'Enter new address' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Add', handler: async (data) => {
            if (data.address && data.address.trim()) {
               const addresses = this.getAddresses(user);
               addresses.push(data.address.trim());
               await this.authService.updateProfile(String(user.id), { addresses });
               this.showToast('Address added');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editAddress(user: User, index: number): Promise<void> {
    const addresses = this.getAddresses(user);
    const alert = await this.alertCtrl.create({
      header: 'Edit Address',
      inputs: [{ name: 'address', type: 'textarea', value: addresses[index], placeholder: 'Address details' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Save', handler: async (data) => {
            if (data.address && data.address.trim()) {
               addresses[index] = data.address.trim();
               await this.authService.updateProfile(String(user.id), { addresses });
               this.showToast('Address updated');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAddress(user: User, index: number): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete Address?',
      message: 'Are you sure you want to remove this address?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: async () => {
            const addresses = this.getAddresses(user);
            addresses.splice(index, 1);
            await this.authService.updateProfile(String(user.id), { addresses });
            this.showToast('Address removed');
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color: 'success' });
    await toast.present();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}
