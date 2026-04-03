import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { User, UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronForwardOutline,
  createOutline,
  giftOutline,
  heartOutline,
  informationCircleOutline,
  locationOutline,
  logOutOutline,
  mailOutline,
  navigateCircleOutline,
  notificationsOutline,
  optionsOutline,
  receiptOutline,
  settingsOutline,
  star
} from 'ionicons/icons';

interface ProfileSummary {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberLabel: string;
  orders: number;
  reviews: number;
  tastePoints: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, BottomNavComponent],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: ProfileSummary = this.buildProfile();

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    addIcons({
      callOutline,
      chevronForwardOutline,
      createOutline,
      giftOutline,
      heartOutline,
      informationCircleOutline,
      locationOutline,
      logOutOutline,
      mailOutline,
      navigateCircleOutline,
      notificationsOutline,
      optionsOutline,
      receiptOutline,
      settingsOutline,
      star
    });
  }

  ngOnInit(): void {
    this.syncProfile();
  }

  ionViewWillEnter(): void {
    this.syncProfile();
  }

  get avatarInitial(): string {
    return this.profile.name.charAt(0).toUpperCase();
  }

  editProfile(): void {
    alert('Profile editing will be added in a future update.');
  }

  goToOrderHistory(): void {
    this.router.navigate(['/order-history']);
  }

  goToFavorites(): void {
    this.router.navigate(['/favorites']);
  }

  goToAddresses(): void {
    alert('Address management will be added in a future update.');
  }

  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  goToLoyalty(): void {
    alert('Loyalty points details will be added in a future update.');
  }

  goToAbout(): void {
    this.router.navigate(['/about-us']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private syncProfile(): void {
    this.profile = this.buildProfile(this.userService.getUser());
  }

  private buildProfile(user?: User | null): ProfileSummary {
    const memberLabel =
      user?.memberType === 'platinum'
        ? 'Platinum Member'
        : user?.memberType === 'gold'
          ? 'Gold Member'
          : 'Silver Member';

    return {
      name: user?.name || 'dwaedwadwa',
      email: user?.email || 'dwaedwadwa@gmail.com',
      phone: user?.phone || '+1 (555) 000-0000',
      address: 'No address set',
      memberLabel,
      orders: 23,
      reviews: 12,
      tastePoints: user?.tastePoints ?? 0
    };
  }
}
