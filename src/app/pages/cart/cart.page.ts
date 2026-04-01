import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { Cart, CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward, cartOutline, receiptOutline, ticketOutline, trash } from 'ionicons/icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon, BottomNavComponent]
})
export class CartPage implements OnInit {
  cart: Cart | null = null;
  promoCode = '';
  promoApplied = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private dataService: DataService
  ) {
    addIcons({ arrowBack, arrowForward, cartOutline, receiptOutline, ticketOutline, trash });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cartState => {
      this.cart = cartState;
    });
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  applyPromo(): void {
    if (this.promoCode.trim() && this.cartService.applyPromoCode(this.promoCode)) {
      this.promoApplied = true;
      setTimeout(() => {
        this.promoApplied = false;
      }, 3000);
    }
  }

  getRestaurantName(restaurantId: string): string {
    return this.dataService.getRestaurant(restaurantId)?.name || 'TasteTrack Kitchen';
  }

  getItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  handleImageError(event: Event, label: string): void {
    const image = event.target as HTMLImageElement | null;

    if (!image || image.dataset['fallbackApplied'] === 'true') {
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = this.getFallbackImage(label);
  }

  goBack(): void {
    this.router.navigate(['/menu']);
  }

  goToCheckout(): void {
    if (this.cart && this.cart.items.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }

  private getFallbackImage(label: string): string {
    const shortLabel = label
      .split(' ')
      .slice(0, 2)
      .join(' ')
      .toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FF8E53"/>
            <stop offset="100%" stop-color="#FF5B2E"/>
          </linearGradient>
        </defs>
        <rect width="240" height="240" rx="28" fill="url(#g)"/>
        <text x="24" y="128" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="700">${shortLabel}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}
