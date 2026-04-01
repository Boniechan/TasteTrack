import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Order {
  id: string;
  restaurantId?: string;
  restaurantName: string;
  restaurantImage: string;
  items: { name: string; quantity: number; price: number; image?: string }[];
  totalPrice: number;
  totalAmount: number;
  status: 'preparing' | 'on-the-way' | 'delivered';
  createdAt: Date;
  estimatedDelivery: Date;
  deliveryAddress: string;
  deliveryMode?: 'delivery' | 'pickup';
  deliveryTimeLabel?: string;
  phoneNumber?: string;
  distance?: number;
  estimatedMinutes?: number;
  deliveryAgent: {
    name: string;
    photo: string;
    rating: number;
    totalDeliveries: number;
  };
  trackingData?: TrackingData;
}

export interface TrackingData {
  latitude: number;
  longitude: number;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  eta: number; // minutes
  route: { lat: number; lng: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.loadOrders();
  }

  private loadOrders(): void {
    const saved = localStorage.getItem('tastetrack_orders');
    if (saved) {
      const orders = JSON.parse(saved).map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        estimatedDelivery: new Date(o.estimatedDelivery)
      }));
      this.ordersSubject.next(orders);
    }
  }

  private saveOrders(): void {
    localStorage.setItem('tastetrack_orders', JSON.stringify(this.ordersSubject.value));
  }

  createOrder(order: Order): Order {
    const orders = this.ordersSubject.value;
    orders.unshift(order);
    this.ordersSubject.next(orders);
    this.saveOrders();
    return order;
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.ordersSubject.value;
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.ordersSubject.next([...orders]);
      this.saveOrders();
    }
  }

  updateTracking(orderId: string, tracking: TrackingData): void {
    const orders = this.ordersSubject.value;
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.trackingData = tracking;
      this.ordersSubject.next([...orders]);
      this.saveOrders();
    }
  }

  getOrder(id: string): Order | undefined {
    return this.ordersSubject.value.find(o => o.id === id);
  }

  getOrders(): Order[] {
    return [...this.ordersSubject.value];
  }

  getActiveOrders(): Order[] {
    return this.ordersSubject.value.filter(o => o.status !== 'delivered');
  }

  getOrderHistory(): Order[] {
    return this.ordersSubject.value.filter(o => o.status === 'delivered');
  }
}
