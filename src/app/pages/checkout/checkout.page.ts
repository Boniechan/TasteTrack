import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Cart } from '../../services/cart.service';
import { CartService } from '../../services/cart.service';
import { UserService, User, Address } from '../../services/user.service';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowBack,
  arrowForward,
  bicycleOutline,
  businessOutline,
  checkmarkCircle,
  cubeOutline,
  ellipseOutline,
  flash,
  heart,
  home,
  locationOutline,
  storefrontOutline,
  timeOutline
} from 'ionicons/icons';

type FulfillmentMode = 'delivery' | 'pickup';

interface CheckoutAddress extends Address {
  icon: string;
}

interface DeliverySlot {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class CheckoutPage implements OnInit {
  cart: Cart | null = null;
  user: User | null = null;
  addresses: CheckoutAddress[] = [];
  selectedAddressId = '';
  selectedDeliveryTime = 'asap';
  fulfillmentMode: FulfillmentMode = 'delivery';

  readonly deliverySlots: DeliverySlot[] = [
    { id: 'asap', label: 'ASAP', subtitle: '25-35 min', icon: 'flash' },
    { id: '12:00', label: '12:00 PM', subtitle: 'Scheduled', icon: 'time-outline' },
    { id: '13:00', label: '1:00 PM', subtitle: 'Scheduled', icon: 'time-outline' },
    { id: '14:00', label: '2:00 PM', subtitle: 'Scheduled', icon: 'time-outline' }
  ];

  private readonly fallbackAddresses: CheckoutAddress[] = [
    {
      id: 'home',
      label: 'Home',
      street: '123 Main St, Apt 4B',
      city: 'New York, NY',
      zipCode: '10001',
      isDefault: true,
      icon: 'home'
    },
    {
      id: 'work',
      label: 'Work',
      street: '456 Business Ave, Suite 200',
      city: 'New York, NY',
      zipCode: '10002',
      isDefault: false,
      icon: 'business-outline'
    },
    {
      id: 'partner',
      label: "Partner's",
      street: '789 Oak Ln',
      city: 'Brooklyn, NY',
      zipCode: '11201',
      isDefault: false,
      icon: 'heart'
    }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private userService: UserService
  ) {
    addIcons({
      addOutline,
      arrowBack,
      arrowForward,
      bicycleOutline,
      businessOutline,
      checkmarkCircle,
      cubeOutline,
      ellipseOutline,
      flash,
      heart,
      home,
      locationOutline,
      storefrontOutline,
      timeOutline
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });

    this.userService.user$.subscribe(user => {
      this.user = user;
    });

    this.userService.addresses$.subscribe(addresses => {
      this.addresses = this.mapAddresses(addresses);
      if (!this.selectedAddressId) {
        this.selectedAddressId = this.addresses[0]?.id || this.fallbackAddresses[0].id;
      }
    });
  }

  get canContinue(): boolean {
    return Boolean(this.cart?.items.length) && (this.fulfillmentMode === 'pickup' || !!this.selectedAddressId);
  }

  get deliveryAddresses(): CheckoutAddress[] {
    return this.addresses.length > 0 ? this.addresses : this.fallbackAddresses;
  }

  get selectedSlot(): DeliverySlot {
    return this.deliverySlots.find(slot => slot.id === this.selectedDeliveryTime) ?? this.deliverySlots[0];
  }

  get selectedAddress(): CheckoutAddress | undefined {
    return this.deliveryAddresses.find(address => address.id === this.selectedAddressId) ?? this.deliveryAddresses[0];
  }

  get itemCount(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }

  openAddNew(): void {
    alert('Address creation will be added in a future update.');
  }

  selectMode(mode: FulfillmentMode): void {
    this.fulfillmentMode = mode;
  }

  selectAddress(addressId: string): void {
    this.selectedAddressId = addressId;
  }

  selectTime(slotId: string): void {
    this.selectedDeliveryTime = slotId;
  }

  goToPayment(): void {
    if (!this.cart || !this.canContinue) {
      return;
    }

    const selectedAddress = this.selectedAddress;
    const checkoutData = {
      fulfillmentMode: this.fulfillmentMode,
      addressLabel: selectedAddress?.label || 'Pickup',
      addressLine: selectedAddress
        ? `${selectedAddress.street}, ${selectedAddress.city} ${selectedAddress.zipCode}`
        : 'Pick up from the restaurant counter',
      deliveryTimeLabel: this.selectedSlot.label,
      deliveryTimeSubtitle: this.selectedSlot.subtitle
    };

    this.router.navigate(['/payment'], { state: { checkoutData } });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  private mapAddresses(addresses: Address[]): CheckoutAddress[] {
    if (!addresses.length) {
      return [];
    }

    return addresses.map(address => ({
      ...address,
      icon: this.getAddressIcon(address.label)
    }));
  }

  private getAddressIcon(label: string): string {
    const normalized = label.toLowerCase();
    if (normalized.includes('home')) {
      return 'home';
    }
    if (normalized.includes('work') || normalized.includes('office')) {
      return 'business-outline';
    }
    if (normalized.includes('partner') || normalized.includes('love')) {
      return 'heart';
    }
    return 'location-outline';
  }
}
