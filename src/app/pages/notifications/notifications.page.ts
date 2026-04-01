import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkCircleOutline, flameOutline, notificationsOffOutline, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];

  constructor(private router: Router) {
    addIcons({
      arrowBack,
      checkmarkCircleOutline,
      flameOutline,
      notificationsOffOutline,
      starOutline
    });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notifications = [
      {
        id: 1,
        icon: 'checkmark-circle-outline',
        title: 'Order Delivered',
        message: 'Your order from Burger Republic has been delivered',
        timestamp: '2 hours ago',
        read: true
      },
      {
        id: 2,
        icon: 'flame-outline',
        title: 'Flash Deal Alert',
        message: '30% OFF on your first order! Use code TASTE30',
        timestamp: '5 hours ago',
        read: false
      },
      {
        id: 3,
        icon: 'star-outline',
        title: 'Rate Your Order',
        message: 'How was your experience with Sakura Sushi Bar?',
        timestamp: '1 day ago',
        read: false
      }
    ];
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
