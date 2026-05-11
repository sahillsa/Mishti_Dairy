export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  unit: string;
  tag: string;
  stock: number;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: number;
  userName: string;
  email: string;
  mobile: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: 'Placed' | 'Packed' | 'Out for delivery' | 'Delivered';
  paymentStatus: 'Paid' | 'Pending';
  paymentMethod: 'Razorpay' | 'Cash on delivery';
  deliverySlot: string;
  date: string;
}

export interface HelpQuery {
  id: string;
  userId: number;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  status: 'Open' | 'In review' | 'Closed';
  date: string;
}

export interface CheckoutDetails {
  address: string;
  mobile: string;
  deliverySlot: string;
  paymentMethod: 'Razorpay' | 'Cash on delivery';
}
