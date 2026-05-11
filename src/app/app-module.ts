import { isDevMode, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AccountPage } from './pages/account/account.page';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard.page';
import { AdminOrdersPage } from './pages/admin-orders/admin-orders.page';
import { AdminQueriesPage } from './pages/admin-queries/admin-queries.page';
import { BottomNavComponent } from './shared/bottom-nav.component';
import { CartPage } from './pages/cart/cart.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { HelpPage } from './pages/help/help.page';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { OrdersPage } from './pages/orders/orders.page';
import { PageHeaderComponent } from './shared/page-header.component';
import { PaymentPage } from './pages/payment/payment.page';
import { ProductsPage } from './pages/products/products.page';
import { RegisterPage } from './pages/register/register.page';

@NgModule({
  declarations: [
    App,
    AccountPage,
    AdminDashboardPage,
    AdminOrdersPage,
    AdminQueriesPage,
    BottomNavComponent,
    CartPage,
    ForgotPasswordPage,
    HelpPage,
    HomePage,
    LoginPage,
    OrdersPage,
    PageHeaderComponent,
    PaymentPage,
    ProductsPage,
    RegisterPage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot({
      mode: 'md',
    }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [App]
})
export class AppModule { }
