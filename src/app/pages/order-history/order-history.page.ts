import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { Order, OrderService } from '../../services/order.service';
import { addIcons } from 'ionicons';
import {
  bagHandle,
  checkmarkCircle,
  cubeOutline,
  locationOutline,
  refreshOutline,
  sparklesOutline,
  starOutline,
  timeOutline
} from 'ionicons/icons';

type OrderTab = 'all' | 'active' | 'past';
type OrderStatus = 'delivered' | 'on-the-way' | 'preparing' | 'cancelled' | 'pending';

interface OrderHistoryItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderHistoryEntry {
  id: string;
  restaurantName: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderHistoryItem[];
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {
  selectedTab: OrderTab = 'all';
  orders: OrderHistoryEntry[] = [];
  filteredOrders: OrderHistoryEntry[] = [];

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {
    addIcons({
      bagHandle,
      checkmarkCircle,
      cubeOutline,
      locationOutline,
      refreshOutline,
      sparklesOutline,
      starOutline,
      timeOutline
    });
  }

  ngOnInit() {
    this.loadOrders();
  }

  ionViewWillEnter(): void {
    this.loadOrders();
  }

  loadOrders() {
    const sampleOrders: OrderHistoryEntry[] = [
      {
        id: 'ORD-2024001',
        restaurantName: 'Burger Republic',
        date: 'Mar 28, 2026',
        status: 'delivered',
        total: 34.97,
        items: [
          {
            name: 'Classic Smash Burger',
            quantity: 2,
            price: 25.98,
            image: 'assets/food/Classic_Smashed.jpeg'
          },
          {
            name: 'Chocolate Lava Cake',
            quantity: 1,
            price: 8.99,
            image: 'assets/food/Chocolate-lava.jpg'
          }
        ]
      },
      {
        id: 'ORD-2024002',
        restaurantName: 'Sakura Sushi Bar',
        date: 'Mar 30, 2026',
        status: 'on-the-way',
        total: 32.98,
        items: [
          {
            name: 'Premium Sushi Platter',
            quantity: 1,
            price: 28.99,
            image: 'assets/food/Premium-Sushi.jpg'
          },
          {
            name: 'California Roll',
            quantity: 1,
            price: 3.99,
            image: 'assets/food/California-roll-.jpg'
          }
        ]
      },
      {
        id: 'ORD-2024003',
        restaurantName: 'Napoli Pizzeria',
        date: 'Mar 30, 2026',
        status: 'preparing',
        total: 34.97,
        items: [
          {
            name: 'Margherita Suprema',
            quantity: 1,
            price: 14.99,
            image: 'assets/food/Margherita-Pizza.jpg'
          },
          {
            name: 'Tropical Acai Smoothie',
            quantity: 2,
            price: 19.98,
            image: 'assets/food/tropical-acai.png'
          }
        ]
      }
    ];

    const liveOrders = this.orderService.getOrders().map(order => this.mapOrder(order));
    const liveOrderIds = new Set(liveOrders.map(order => order.id));

    this.orders = [
      ...liveOrders,
      ...sampleOrders.filter(order => !liveOrderIds.has(order.id))
    ];

    this.filterOrders();
  }

  selectTab(tab: OrderTab): void {
    this.selectedTab = tab;
    this.filterOrders();
  }

  filterOrders() {
    if (this.selectedTab === 'all') {
      this.filteredOrders = [...this.orders];
    } else if (this.selectedTab === 'active') {
      this.filteredOrders = this.orders.filter(
        (o) => o.status === 'preparing' || o.status === 'on-the-way'
      );
    } else {
      this.filteredOrders = this.orders.filter(
        (o) => o.status === 'delivered' || o.status === 'cancelled'
      );
    }
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      delivered: 'Delivered',
      'on-the-way': 'On the Way',
      preparing: 'Preparing',
      cancelled: 'Cancelled',
      pending: 'Pending'
    };

    return labels[status];
  }

  getStatusIcon(status: OrderStatus): string {
    const icons: Record<OrderStatus, string> = {
      delivered: 'checkmark-circle',
      'on-the-way': 'location-outline',
      preparing: 'sparkles-outline',
      cancelled: 'cube-outline',
      pending: 'time-outline'
    };

    return icons[status];
  }

  getTrackButtonLabel(status: OrderStatus): string {
    return status === 'preparing' ? 'View Status' : 'Track Order';
  }

  getItemPriceLabel(item: OrderHistoryItem): string {
    return `$${item.price.toFixed(2)}`;
  }

  handleImageError(event: Event, label: string): void {
    const image = event.target as HTMLImageElement | null;

    if (!image || image.dataset['fallbackApplied'] === 'true') {
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = this.getFallbackImage(label);
  }

  reorder(orderId: string): void {
    void orderId;
    this.router.navigate(['/menu']);
  }

  rateOrder(orderId: string): void {
    void orderId;
  }

  trackOrder(orderId: string): void {
    this.router.navigate(['/order-tracking', orderId]);
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order-tracking', orderId]);
  }

  private mapOrder(order: Order): OrderHistoryEntry {
    return {
      id: order.id,
      restaurantName: order.restaurantName,
      date: order.createdAt.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: order.status,
      total: order.totalAmount || order.totalPrice,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || this.getFallbackImage(item.name)
      }))
    };
  }

  private getFallbackImage(label: string): string {
    const shortLabel = label
      .split(' ')
      .slice(0, 2)
      .join(' ')
      .toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FF8E53"/>
            <stop offset="100%" stop-color="#FF5B2E"/>
          </linearGradient>
        </defs>
        <rect width="96" height="96" rx="16" fill="url(#g)"/>
        <text x="12" y="54" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="13" font-weight="700">${shortLabel}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}
