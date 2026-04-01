import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  restaurantId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly legacyImageMap: Record<string, string> = {
    'assets/food/burger.jpg': 'assets/food/Classic_Smashed.jpeg',
    'assets/food/burger2.jpg': 'assets/food/double-cheese.jpg',
    'assets/food/sushi.jpg': 'assets/food/Premium-Sushi.jpg',
    'assets/food/california-roll.jpg': 'assets/food/California-roll-.jpg',
    'assets/food/pizza.jpg': 'assets/food/Margherita-Pizza.jpg',
    'assets/food/pizza-pepperoni.jpg': 'assets/food/Peperoni_Pizza.jpg',
    'assets/food/dessert.jpg': 'assets/food/Chocolate-lava.jpg',
    'assets/food/smoothie.jpg': 'assets/food/tropical-acai.png'
  };

  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    subtotal: 0,
    tax: 0,
    deliveryFee: 2.99,
    discount: 0,
    total: 0
  });

  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const saved = localStorage.getItem('tastetrack_cart');
    if (saved) {
      const cart = JSON.parse(saved) as Cart;
      cart.items = cart.items.map(item => ({
        ...item,
        image: this.normalizeImagePath(item.image)
      }));
      this.cartSubject.next(cart);
      this.saveCart();
    }
  }

  private saveCart(): void {
    localStorage.setItem('tastetrack_cart', JSON.stringify(this.cartSubject.value));
  }

  private updateTotals(): void {
    const cart = this.cartSubject.value;
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.tax = parseFloat((cart.subtotal * 0.08).toFixed(2));
    cart.total = parseFloat((cart.subtotal + cart.tax + cart.deliveryFee - cart.discount).toFixed(2));
    this.cartSubject.next(cart);
    this.saveCart();
  }

  addItem(item: CartItem): void {
    const cart = this.cartSubject.value;
    const normalizedItem = {
      ...item,
      image: this.normalizeImagePath(item.image)
    };

    if (normalizedItem.restaurantId && cart.restaurantId && cart.restaurantId !== normalizedItem.restaurantId) {
      if (confirm('Your cart has items from another restaurant. Replace them?')) {
        cart.items = [];
        cart.restaurantId = normalizedItem.restaurantId;
      } else {
        return;
      }
    }

    cart.restaurantId = normalizedItem.restaurantId;
    const existing = cart.items.find(i => i.id === normalizedItem.id);
    if (existing) {
      existing.quantity += normalizedItem.quantity;
      existing.image = normalizedItem.image;
    } else {
      cart.items.push(normalizedItem);
    }

    this.updateTotals();
  }

  removeItem(itemId: string): void {
    const cart = this.cartSubject.value;
    cart.items = cart.items.filter(i => i.id !== itemId);
    if (cart.items.length === 0) {
      cart.restaurantId = undefined;
    }
    this.updateTotals();
  }

  updateQuantity(itemId: string, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart.items.find(i => i.id === itemId);
    if (!item) {
      return;
    }

    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    item.quantity = quantity;
    this.updateTotals();
  }

  applyPromoCode(code: string): boolean {
    const cart = this.cartSubject.value;
    const discounts: { [key: string]: number } = {
      TASTE30: 0.3,
      FIRST20: 0.2,
      SAVE10: 0.1,
      WELCOME15: 0.15
    };

    const discount = discounts[code.toUpperCase()];
    if (discount) {
      cart.discount = parseFloat((cart.subtotal * discount).toFixed(2));
      this.updateTotals();
      return true;
    }

    return false;
  }

  clearCart(): void {
    this.cartSubject.next({
      items: [],
      subtotal: 0,
      tax: 0,
      deliveryFee: 2.99,
      discount: 0,
      total: 0
    });
    this.saveCart();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  setDeliveryFee(fee: number): void {
    const cart = this.cartSubject.value;
    cart.deliveryFee = fee;
    this.updateTotals();
  }

  private normalizeImagePath(path: string): string {
    return this.legacyImageMap[path] ?? path;
  }
}
