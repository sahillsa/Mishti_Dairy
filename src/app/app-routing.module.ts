import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './core/admin.guard';
import { UserGuard } from './core/user.guard';
import { AccountPage } from './pages/account/account.page';
import { AdminControlPage } from './pages/admin-control/admin-control.page';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard.page';
import { AdminOrdersPage } from './pages/admin-orders/admin-orders.page';
import { AdminProductsPage } from './pages/admin-products/admin-products.page';
import { AdminQueriesPage } from './pages/admin-queries/admin-queries.page';
import { CartPage } from './pages/cart/cart.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { HelpPage } from './pages/help/help.page';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { OrderDetailPage } from './pages/order-detail/order-detail.page';
import { OrdersPage } from './pages/orders/orders.page';
import { PaymentPage } from './pages/payment/payment.page';
import { ProductsPage } from './pages/products/products.page';
import { QueryDetailPage } from './pages/query-detail/query-detail.page';
import { RegisterPage } from './pages/register/register.page';

const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forgot-password', component: ForgotPasswordPage },

  { path: 'home', component: HomePage, canActivate: [UserGuard] },
  { path: 'products', component: ProductsPage, canActivate: [UserGuard] },
  { path: 'cart', component: CartPage, canActivate: [UserGuard] },
  { path: 'payment', component: PaymentPage, canActivate: [UserGuard] },
  { path: 'orders', component: OrdersPage, canActivate: [UserGuard] },
  { path: 'orders/:orderId', component: OrderDetailPage, canActivate: [UserGuard] },
  { path: 'account', component: AccountPage, canActivate: [UserGuard] },
  { path: 'help', component: HelpPage, canActivate: [UserGuard] },
  { path: 'help/:queryId', component: QueryDetailPage, canActivate: [UserGuard] },

  { path: 'admin', pathMatch: 'full', redirectTo: 'admin/dashboard' },
  { path: 'admin/dashboard', component: AdminDashboardPage, canActivate: [AdminGuard] },
  { path: 'admin/orders', component: AdminOrdersPage, canActivate: [AdminGuard] },
  { path: 'admin/orders/:orderId', component: OrderDetailPage, canActivate: [AdminGuard] },
  { path: 'admin/products', component: AdminProductsPage, canActivate: [AdminGuard] },
  { path: 'admin/queries', component: AdminQueriesPage, canActivate: [AdminGuard] },
  { path: 'admin/queries/:queryId', component: QueryDetailPage, canActivate: [AdminGuard] },
  { path: 'admin/control', component: AdminControlPage, canActivate: [AdminGuard] },

  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
