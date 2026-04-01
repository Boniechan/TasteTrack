import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  bulbOutline,
  chatbubblesOutline,
  chevronForwardOutline,
  compassOutline,
  flashOutline,
  globeOutline,
  heartOutline,
  logoInstagram,
  mailOutline,
  peopleOutline,
  restaurantOutline,
  ribbonOutline,
  sparklesOutline,
  starOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage {
  readonly stats = [
    { icon: 'people-outline', value: '500K+', label: 'Happy Users', tone: 'violet' },
    { icon: 'restaurant-outline', value: '2,400+', label: 'Restaurants', tone: 'orange' },
    { icon: 'star-outline', value: '4.9', label: 'App Rating', tone: 'gold' },
    { icon: 'ribbon-outline', value: '12', label: 'City Awards', tone: 'teal' }
  ];

  readonly values = [
    {
      icon: 'flash-outline',
      title: 'Speed',
      description: 'Average delivery time under 30 minutes with reliable live tracking.'
    },
    {
      icon: 'sparkles-outline',
      title: 'Quality',
      description: 'Curated restaurants, fresh menus, and experiences worth repeating.'
    },
    {
      icon: 'heart-outline',
      title: 'Community',
      description: 'We help local restaurants reach more customers and grow sustainably.'
    }
  ];

  readonly contactLinks = [
    { icon: 'mail-outline', label: 'support@tastetrack.com', action: () => this.openSocial('mail') },
    { icon: 'logo-instagram', label: '@tastetrack', action: () => this.openSocial('instagram') },
    { icon: 'globe-outline', label: 'www.tastetrack.com', action: () => this.openSocial('website') }
  ];

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      bulbOutline,
      chatbubblesOutline,
      chevronForwardOutline,
      compassOutline,
      flashOutline,
      globeOutline,
      heartOutline,
      logoInstagram,
      mailOutline,
      peopleOutline,
      restaurantOutline,
      ribbonOutline,
      sparklesOutline,
      starOutline
    });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  openSocial(platform: string): void {
    const urls: Record<string, string> = {
      instagram: 'https://instagram.com/tastetrack',
      website: 'https://www.tastetrack.com',
      mail: 'mailto:support@tastetrack.com'
    };

    const url = urls[platform];
    if (url) {
      window.open(url, '_blank');
    }
  }

  openTerms(): void {
    alert('Terms of Service will be added in a future update.');
  }

  openPrivacy(): void {
    alert('Privacy Policy will be added in a future update.');
  }
}
