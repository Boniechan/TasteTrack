import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { restaurant, flash, pin } from 'ionicons/icons';

interface Slide {
  id: number;
  icon: string;
  title: string;
  description: string;
  image?: string;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon]
})
export class OnboardingPage {
  currentSlide = 0;

  slides: Slide[] = [
    {
      id: 1,
      icon: 'restaurant',
      title: 'Discover Amazing Food',
      description: 'Explore hundreds of restaurants and cuisines right at your fingertips'
    },
    {
      id: 2,
      icon: 'flash',
      title: 'Fast & Easy Ordering',
      description: 'Order your favorite meals in seconds with our simple and intuitive interface'
    },
    {
      id: 3,
      icon: 'pin',
      title: 'Real-Time Tracking',
      description: 'Track your order live from the kitchen to your doorstep'
    }
  ];

  constructor(private router: Router) {
    addIcons({ restaurant, flash, pin });
  }

  nextSlide(): void {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.goToLogin();
    }
  }

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  skip(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
