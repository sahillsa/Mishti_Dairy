export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  addresses?: string[];
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  unit: string;
  tag: string;
  stock: number;
  rating: number;
  isOutOfStock: boolean;
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
  status: OrderStatus;
  paymentStatus: 'Paid' | 'Pending';
  paymentMethod: 'Razorpay' | 'Cash on delivery';
  deliverySlot: string;
  date: string;
  trackingId?: string;
  trackingCompany?: string;
  messages: ThreadMessage[];
}

export interface HelpQuery {
  id: string;
  userId: number;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  status: QueryStatus;
  date: string;
  messages: ThreadMessage[];
}

export interface CheckoutDetails {
  address: string;
  mobile: string;
  deliverySlot: string;
  paymentMethod: 'Razorpay' | 'Cash on delivery';
}

export type OrderStatus = 'Placed' | 'Accepted' | 'In review' | 'Shipped' | 'Delivered' | 'Cancelled';

export type QueryStatus = 'Open' | 'In review' | 'Waiting for user' | 'Resolved' | 'Closed';

export interface ThreadMessage {
  id: string;
  authorRole: UserRole;
  authorName: string;
  message: string;
  date: string;
}

export interface ProductDraft {
  name: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  unit: string;
  tag: string;
  stock: number;
  rating: number;
}
