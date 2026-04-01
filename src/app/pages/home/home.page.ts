import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonBadge, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DataService, FoodItem, Restaurant } from '../../services/data.service';
import { User, UserService } from '../../services/user.service';
import { NotificationService } from '../../services/favorites.service';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { addIcons } from 'ionicons';
import {
  fastFoodOutline,
  fishOutline,
  flame,
  locationSharp,
  notificationsOutline,
  nutritionOutline,
  pizzaOutline,
  restaurant,
  search,
  star,
  storefrontOutline
} from 'ionicons/icons';

interface HomeCategory {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonBadge, BottomNavComponent]
})
export class HomePage implements OnInit {
  restaurants: Restaurant[] = [];
  featuredFoods: FoodItem[] = [];
  user: User | null = null;
  unreadNotifications = 0;
  selectedCategory = 'All';
  readonly categories: HomeCategory[] = [
    { id: 'All', label: 'All', icon: 'restaurant' },
    { id: 'Burgers', label: 'Burgers', icon: 'fast-food-outline' },
    { id: 'Pizza', label: 'Pizza', icon: 'pizza-outline' },
    { id: 'Sushi', label: 'Sushi', icon: 'fish-outline' },
    { id: 'Pasta', label: 'Pasta', icon: 'nutrition-outline' }
  ];

  constructor(
    private router: Router,
    private dataService: DataService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    addIcons({
      fastFoodOutline,
      fishOutline,
      flame,
      locationSharp,
      notificationsOutline,
      nutritionOutline,
      pizzaOutline,
      restaurant,
      search,
      star,
      storefrontOutline
    });
  }

  ngOnInit(): void {
    this.restaurants = this.dataService.getRestaurants();
    this.updateFeaturedFoods();

    this.userService.user$.subscribe(user => {
      this.user = user;
    });

    this.notificationService.notifications$.subscribe(notifs => {
      this.unreadNotifications = notifs.filter(n => !n.read).length;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.updateFeaturedFoods();
  }

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }

  goToFoodDetail(foodId: string): void {
    this.router.navigate(['/food-detail', foodId]);
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  getPopularTitle(): string {
    return this.selectedCategory === 'All' ? 'Popular Now' : this.selectedCategory;
  }

  private updateFeaturedFoods(): void {
    this.featuredFoods = this.dataService.getFeaturedFoods(this.selectedCategory, 6);
  }
}
