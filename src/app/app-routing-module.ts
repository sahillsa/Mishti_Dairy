import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './core/admin.guard';
import { AuthGuard } from './core/auth.guard';
import { AccountPage } from './pages/account/account.page';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard.page';
import { AdminOrdersPage } from './pages/admin-orders/admin-orders.page';
import { AdminQueriesPage } from './pages/admin-queries/admin-queries.page';
import { CartPage } from './pages/cart/cart.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { HelpPage } from './pages/help/help.page';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { OrdersPage } from './pages/orders/orders.page';
import { PaymentPage } from './pages/payment/payment.page';
import { ProductsPage } from './pages/products/products.page';
import { RegisterPage } from './pages/register/register.page';

const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'home', component: HomePage, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsPage, canActivate: [AuthGuard] },
  { path: 'cart', component: CartPage, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentPage, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersPage, canActivate: [AuthGuard] },
  { path: 'account', component: AccountPage, canActivate: [AuthGuard] },
  { path: 'help', component: HelpPage, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardPage, canActivate: [AdminGuard] },
  { path: 'admin/orders', component: AdminOrdersPage, canActivate: [AdminGuard] },
  { path: 'admin/queries', component: AdminQueriesPage, canActivate: [AdminGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
