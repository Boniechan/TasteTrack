import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderService } from '../../services/order.service';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  bagHandle,
  bicycle,
  callOutline,
  chatbubbleOutline,
  checkmark,
  checkmarkCircle,
  locationOutline,
  navigateCircle,
  restaurant as restaurantIcon,
  sparklesOutline,
  star,
  starOutline,
  trophyOutline
} from 'ionicons/icons';

interface TrackingStep {
  id: 'confirmed' | 'preparing' | 'on-the-way' | 'delivered';
  title: string;
  description: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class OrderTrackingPage implements OnInit, OnDestroy {
  order: Order | null = null;
  etaCountdown = '16 min';
  rating = 0;
  orderStatus: 'confirmed' | 'preparing' | 'on-the-way' | 'delivered' = 'confirmed';
  timelineSteps: TrackingStep[] = [];

  private updateTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {
    addIcons({
      arrowBack,
      bagHandle,
      bicycle,
      callOutline,
      chatbubbleOutline,
      checkmark,
      checkmarkCircle,
      locationOutline,
      navigateCircle,
      restaurant: restaurantIcon,
      sparklesOutline,
      star,
      starOutline,
      trophyOutline
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.order = this.orderService.getOrder(id) ?? this.getFallbackOrder(id);
    if (!this.order) {
      return;
    }

    this.syncFromOrder();
    this.startTrackingTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  get isDelivered(): boolean {
    return this.orderStatus === 'delivered';
  }

  get headerTitle(): string {
    return this.isDelivered ? 'Order Delivered' : 'Live Tracking';
  }

  get etaLabel(): string {
    return this.isDelivered ? 'Delivered' : 'ETA';
  }

  get driverVehicle(): string {
    return this.order?.trackingData?.vehicleNumber || 'Honda PCX - AB-4521';
  }

  get progressCardTitle(): string {
    return this.isDelivered ? 'Delivery Complete' : 'Order Progress';
  }

  get orderTotal(): number {
    return this.order?.totalAmount || this.order?.totalPrice || 0;
  }

  get statusChipText(): string {
    if (this.isDelivered) {
      return 'Delivered Successfully';
    }

    if (this.orderStatus === 'on-the-way') {
      return 'Rider is on the way';
    }

    return 'Preparing your order';
  }

  isStatusPassed(status: TrackingStep['id']): boolean {
    const statuses: TrackingStep['id'][] = ['confirmed', 'preparing', 'on-the-way', 'delivered'];
    return statuses.indexOf(this.orderStatus) >= statuses.indexOf(status);
  }

  callDriver(): void {
    void this.order?.trackingData?.driverPhone;
  }

  chatDriver(): void {
    void this.order?.deliveryAgent?.name;
  }

  submitRating(stars: number): void {
    this.rating = stars;
  }

  submitReview(): void {
    if (this.rating > 0) {
      this.router.navigate(['/order-history']);
    }
  }

  goBack(): void {
    this.router.navigate(['/order-history']);
  }

  private syncFromOrder(): void {
    if (!this.order) {
      return;
    }

    this.orderStatus = this.order.status;
    this.etaCountdown = this.getEtaCountdown(this.order);
    this.timelineSteps = this.buildTimeline(this.order);
  }

  private startTrackingTimer(): void {
    if (!this.order || this.order.status === 'delivered') {
      return;
    }

    const rapidOrder = this.isRapidOrder(this.order);
    const intervalMs = rapidOrder ? 1000 : 60000;

    this.clearTimer();
    this.updateTimer = setInterval(() => {
      if (!this.order) {
        this.clearTimer();
        return;
      }

      const remainingMs = this.getRemainingMs(this.order.estimatedDelivery);
      if (remainingMs <= 0) {
        this.markDelivered();
        return;
      }

      if (rapidOrder) {
        const totalMs = this.order.estimatedDelivery.getTime() - this.order.createdAt.getTime();
        const switchToDeliveryMs = Math.max(3000, Math.floor(totalMs * 0.6));
        if (this.order.status === 'preparing' && remainingMs <= switchToDeliveryMs) {
          this.order.status = 'on-the-way';
          this.orderService.updateOrderStatus(this.order.id, 'on-the-way');
        }
      } else if (this.order.status === 'preparing' && remainingMs <= 18 * 60000) {
        this.order.status = 'on-the-way';
        this.orderService.updateOrderStatus(this.order.id, 'on-the-way');
      }

      this.syncFromOrder();
    }, intervalMs);
  }

  private clearTimer(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  private markDelivered(): void {
    if (!this.order) {
      return;
    }

    this.order.status = 'delivered';
    this.orderService.updateOrderStatus(this.order.id, 'delivered');
    this.syncFromOrder();
    this.clearTimer();
  }

  private buildTimeline(order: Order): TrackingStep[] {
    const rapidOrder = this.isRapidOrder(order);
    const confirmedAt = new Date(order.createdAt);
    const preparingAt = rapidOrder
      ? new Date(confirmedAt.getTime() + 1000)
      : new Date(confirmedAt.getTime() + 2 * 60000);
    const onTheWayAt = rapidOrder
      ? new Date(confirmedAt.getTime() + 2000)
      : new Date(Math.max(preparingAt.getTime() + 16 * 60000, order.estimatedDelivery.getTime() - 17 * 60000));
    const deliveredAt = new Date(order.estimatedDelivery);

    return [
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been placed',
        time: this.formatTimelineTime(confirmedAt, rapidOrder),
        icon: 'checkmark'
      },
      {
        id: 'preparing',
        title: 'Being Prepared',
        description: 'Chef is cooking your food',
        time: this.formatTimelineTime(preparingAt, rapidOrder),
        icon: 'restaurant'
      },
      {
        id: 'on-the-way',
        title: 'Out for Delivery',
        description: 'Rider is on the way',
        time: this.formatTimelineTime(onTheWayAt, rapidOrder),
        icon: 'bicycle'
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Enjoy your meal!',
        time: this.isDelivered
          ? this.formatTimelineTime(deliveredAt, rapidOrder)
          : `Est. ${this.formatTimelineTime(deliveredAt, rapidOrder)}`,
        icon: 'checkmark-circle'
      }
    ];
  }

  private getEtaCountdown(order: Order): string {
    if (order.status === 'delivered') {
      return '0 sec';
    }

    const remainingMs = this.getRemainingMs(order.estimatedDelivery);
    if (this.isRapidOrder(order)) {
      return `${Math.max(1, Math.ceil(remainingMs / 1000))} sec`;
    }

    return `${Math.max(1, Math.ceil(remainingMs / 60000))} min`;
  }

  private getRemainingMs(date: Date): number {
    return Math.max(0, date.getTime() - Date.now());
  }

  private isRapidOrder(order: Order): boolean {
    return order.estimatedDelivery.getTime() - order.createdAt.getTime() <= 15000;
  }

  private formatTimelineTime(date: Date, includeSeconds: boolean): string {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined
    });
  }

  private getFallbackOrder(id: string): Order | null {
    const now = Date.now();
    const fallbackOrders: Record<string, Order> = {
      'ORD-2024001': {
        id: 'ORD-2024001',
        restaurantId: 'burger-republic',
        restaurantName: 'Burger Republic',
        restaurantImage: 'assets/Restaurant/Burger-Republic.jpg',
        items: [
          { name: 'Classic Smash Burger', quantity: 2, price: 25.98, image: 'assets/food/Classic_Smashed.jpeg' },
          { name: 'Chocolate Lava Cake', quantity: 1, price: 8.99, image: 'assets/food/Chocolate-lava.jpg' }
        ],
        totalPrice: 34.97,
        totalAmount: 34.97,
        status: 'delivered',
        createdAt: new Date(now - 65 * 60000),
        estimatedDelivery: new Date(now - 8 * 60000),
        deliveryMode: 'delivery',
        deliveryTimeLabel: 'ASAP',
        deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
        distance: 0.8,
        estimatedMinutes: 0,
        phoneNumber: '+1 (555) 123-4567',
        deliveryAgent: {
          name: 'Marco Rodriguez',
          photo: 'assets/icon/tastetrack-logo.svg',
          rating: 4.9,
          totalDeliveries: 312
        },
        trackingData: {
          latitude: 40.7128,
          longitude: -74.006,
          driverName: 'Marco Rodriguez',
          driverPhone: '+1 (555) 123-4567',
          vehicleNumber: 'Honda PCX - AB-4521',
          eta: 0,
          route: []
        }
      },
      'ORD-2024002': {
        id: 'ORD-2024002',
        restaurantId: 'sakura-sushi',
        restaurantName: 'Sakura Sushi Bar',
        restaurantImage: 'assets/Restaurant/Sakura-sushi-bar.jpg',
        items: [
          { name: 'Premium Sushi Platter', quantity: 1, price: 28.99, image: 'assets/food/Premium-Sushi.jpg' }
        ],
        totalPrice: 32.98,
        totalAmount: 32.98,
        status: 'on-the-way',
        createdAt: new Date(now - 18 * 60000),
        estimatedDelivery: new Date(now + 16 * 60000),
        deliveryMode: 'delivery',
        deliveryTimeLabel: 'ASAP',
        deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
        distance: 2.4,
        estimatedMinutes: 16,
        phoneNumber: '+1 (555) 123-4567',
        deliveryAgent: {
          name: 'Marco Rodriguez',
          photo: 'assets/icon/tastetrack-logo.svg',
          rating: 4.9,
          totalDeliveries: 312
        },
        trackingData: {
          latitude: 40.7128,
          longitude: -74.006,
          driverName: 'Marco Rodriguez',
          driverPhone: '+1 (555) 123-4567',
          vehicleNumber: 'Honda PCX - AB-4521',
          eta: 16,
          route: []
        }
      },
      'ORD-2024003': {
        id: 'ORD-2024003',
        restaurantId: 'napoli-pizza',
        restaurantName: 'Napoli Pizzeria',
        restaurantImage: 'assets/Restaurant/Napoli-Pizzeria.jpg',
        items: [
          { name: 'Margherita Suprema', quantity: 1, price: 14.99, image: 'assets/food/Margherita-Pizza.jpg' },
          { name: 'Tropical Acai Smoothie', quantity: 2, price: 19.98, image: 'assets/food/tropical-acai.png' }
        ],
        totalPrice: 34.97,
        totalAmount: 34.97,
        status: 'preparing',
        createdAt: new Date(now - 6 * 60000),
        estimatedDelivery: new Date(now + 26 * 60000),
        deliveryMode: 'delivery',
        deliveryTimeLabel: 'ASAP',
        deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
        distance: 1.5,
        estimatedMinutes: 26,
        phoneNumber: '+1 (555) 123-4567',
        deliveryAgent: {
          name: 'Marco Rodriguez',
          photo: 'assets/icon/tastetrack-logo.svg',
          rating: 4.9,
          totalDeliveries: 312
        },
        trackingData: {
          latitude: 40.7128,
          longitude: -74.006,
          driverName: 'Marco Rodriguez',
          driverPhone: '+1 (555) 123-4567',
          vehicleNumber: 'Honda PCX - AB-4521',
          eta: 26,
          route: []
        }
      }
    };

    return fallbackOrders[id] ?? null;
  }
}
