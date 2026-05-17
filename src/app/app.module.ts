import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isDevMode, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AccountPage } from './pages/account/account.page';
import { AdminControlPage } from './pages/admin-control/admin-control.page';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard.page';
import { AdminOrdersPage } from './pages/admin-orders/admin-orders.page';
import { AdminProductsPage } from './pages/admin-products/admin-products.page';
import { AdminQueriesPage } from './pages/admin-queries/admin-queries.page';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BottomNavComponent } from './shared/bottom-nav.component';
import { CartPage } from './pages/cart/cart.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { HelpPage } from './pages/help/help.page';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { OrderDetailPage } from './pages/order-detail/order-detail.page';
import { OrdersPage } from './pages/orders/orders.page';
import { PageHeaderComponent } from './shared/page-header.component';
import { PaymentPage } from './pages/payment/payment.page';
import { ProductsPage } from './pages/products/products.page';
import { QueryDetailPage } from './pages/query-detail/query-detail.page';
import { RegisterPage } from './pages/register/register.page';

@NgModule({
  declarations: [
    AppComponent,
    AccountPage,
    AdminControlPage,
    AdminDashboardPage,
    AdminOrdersPage,
    AdminProductsPage,
    AdminQueriesPage,
    BottomNavComponent,
    CartPage,
    ForgotPasswordPage,
    HelpPage,
    HomePage,
    LoginPage,
    OrderDetailPage,
    OrdersPage,
    PageHeaderComponent,
    PaymentPage,
    ProductsPage,
    QueryDetailPage,
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
  providers: [provideBrowserGlobalErrorListeners(), { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
