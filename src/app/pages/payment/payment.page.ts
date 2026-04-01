import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Cart, CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/favorites.service';
import { Order, OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  cardOutline,
  cashOutline,
  checkmarkCircle,
  chevronForward,
  ellipseOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  walletOutline
} from 'ionicons/icons';

type PaymentMethod = 'card' | 'wallet' | 'cash';

interface CheckoutState {
  fulfillmentMode: 'delivery' | 'pickup';
  addressLabel: string;
  addressLine: string;
  deliveryTimeLabel: string;
  deliveryTimeSubtitle: string;
}

interface SavedCard {
  id: string;
  brand: string;
  masked: string;
  expiry: string;
  accent: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon]
})
export class PaymentPage implements OnInit {
  cart: Cart | null = null;
  paymentMethod: PaymentMethod = 'card';
  selectedSavedCardId = 'visa-4242';
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  isProcessing = false;
  walletBalance = 45.6;
  checkoutData: CheckoutState = {
    fulfillmentMode: 'delivery',
    addressLabel: 'Home',
    addressLine: '123 Main St, Apt 4B, New York, NY 10001',
    deliveryTimeLabel: 'ASAP',
    deliveryTimeSubtitle: '25-35 min'
  };

  readonly savedCards: SavedCard[] = [
    { id: 'visa-4242', brand: 'Visa', masked: '•••• •••• •••• 4242', expiry: '12/27', accent: 'visa' },
    { id: 'mc-8835', brand: 'Mastercard', masked: '•••• •••• •••• 8835', expiry: '09/26', accent: 'mastercard' }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private dataService: DataService,
    private orderService: OrderService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    addIcons({
      arrowBack,
      cardOutline,
      cashOutline,
      checkmarkCircle,
      chevronForward,
      ellipseOutline,
      lockClosedOutline,
      shieldCheckmarkOutline,
      walletOutline
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });

    const navigationState = history.state?.checkoutData as CheckoutState | undefined;
    if (navigationState) {
      this.checkoutData = navigationState;
    }
  }

  get totalAmount(): number {
    return this.cart?.total ?? 0;
  }

  get itemCount(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }

  get canSubmit(): boolean {
    if (!this.cart?.items.length || this.isProcessing) {
      return false;
    }

    if (this.paymentMethod === 'wallet') {
      return this.walletBalance >= this.totalAmount;
    }

    if (this.paymentMethod === 'cash') {
      return true;
    }

    return !!this.selectedSavedCardId || this.isNewCardValid();
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod = method;
  }

  selectSavedCard(cardId: string): void {
    this.selectedSavedCardId = cardId;
  }

  clearSavedCardSelection(): void {
    this.selectedSavedCardId = '';
  }

  processPayment(): void {
    if (!this.validatePayment() || !this.cart) {
      return;
    }

    const restaurant = this.dataService.getRestaurant(this.cart.restaurantId || '');
    const createdAt = new Date();
    const estimatedDelivery = new Date(createdAt.getTime() + 5000);
    const orderId = `ORD-${Date.now()}`;

    const order: Order = {
      id: orderId,
      restaurantId: restaurant?.id,
      restaurantName: restaurant?.name || 'TasteTrack Kitchen',
      restaurantImage: restaurant?.image || 'assets/Restaurant/Burger-Republic.jpg',
      items: this.cart.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      totalPrice: this.totalAmount,
      totalAmount: this.totalAmount,
      status: 'preparing',
      createdAt,
      estimatedDelivery,
      estimatedMinutes: 1,
      deliveryMode: this.checkoutData.fulfillmentMode,
      deliveryTimeLabel: this.checkoutData.deliveryTimeLabel,
      deliveryAddress:
        this.checkoutData.fulfillmentMode === 'pickup'
          ? `${restaurant?.name || 'TasteTrack'} pickup counter`
          : this.checkoutData.addressLine,
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
        eta: 1,
        route: []
      }
    };

    this.isProcessing = true;

    setTimeout(() => {
      this.orderService.createOrder(order);
      this.userService.addTastePoints(Math.round(this.totalAmount));
      this.notificationService.addNotification({
        title: 'Order Placed',
        message: `Your order #${order.id} is now on live tracking.`,
        type: 'order',
        read: false
      });
      this.cartService.clearCart();
      this.router.navigate(['/order-tracking', order.id]);
      this.isProcessing = false;
    }, 900);
  }

  goBack(): void {
    this.router.navigate(['/checkout']);
  }

  formatCardNumber(event: Event): void {
    const input = (event.target as HTMLInputElement).value.replace(/\s/g, '').replace(/\D/g, '');
    let formatted = '';
    for (let index = 0; index < input.length; index += 4) {
      formatted += `${input.slice(index, index + 4)} `;
    }
    this.cardNumber = formatted.trim();
  }

  formatCardExpiry(event: Event): void {
    const input = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.cardExpiry = input.length > 2 ? `${input.slice(0, 2)}/${input.slice(2)}` : input;
  }

  private validatePayment(): boolean {
    if (this.paymentMethod === 'wallet' && this.walletBalance < this.totalAmount) {
      alert('Your wallet balance is not enough for this payment.');
      return false;
    }

    if (this.paymentMethod === 'card' && !this.selectedSavedCardId && !this.isNewCardValid()) {
      alert('Please choose a saved card or complete the new card details.');
      return false;
    }

    return true;
  }

  private isNewCardValid(): boolean {
    return this.cardNumber.replace(/\s/g, '').length >= 13 &&
      this.cardName.trim().length > 0 &&
      this.cardExpiry.length === 5 &&
      this.cardCvv.length >= 3;
  }
}
