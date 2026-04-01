import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { CartService } from '../../services/cart.service';
import { addIcons } from 'ionicons';
import { cart, cartOutline, home, homeOutline, person, personOutline, receipt, receiptOutline, restaurant, restaurantOutline } from 'ionicons/icons';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  activeIcon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  cartCount = 0;
  readonly navItems: NavItem[] = [
    { label: 'Home', route: '/home', icon: 'home-outline', activeIcon: 'home' },
    { label: 'Menu', route: '/menu', icon: 'restaurant-outline', activeIcon: 'restaurant' },
    { label: 'Cart', route: '/cart', icon: 'cart-outline', activeIcon: 'cart' },
    { label: 'Orders', route: '/order-history', icon: 'receipt-outline', activeIcon: 'receipt' },
    { label: 'Profile', route: '/profile', icon: 'person-outline', activeIcon: 'person' }
  ];

  constructor(
    private router: Router,
    private cartService: CartService
  ) {
    addIcons({
      cart,
      cartOutline,
      home,
      homeOutline,
      person,
      personOutline,
      receipt,
      receiptOutline,
      restaurant,
      restaurantOutline
    });

    this.cartService.cart$.subscribe(cartState => {
      this.cartCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(`${route}/`);
  }

  isCart(route: string): boolean {
    return route === '/cart';
  }

  navigate(route: string): void {
    if (!this.isActive(route)) {
      this.router.navigate([route]);
    }
  }
}
