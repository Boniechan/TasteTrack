import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { DataService, FoodItem } from '../../services/data.service';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { addIcons } from 'ionicons';
import {
  add as addIcon,
  arrowBack,
  cart,
  checkmark,
  flameOutline,
  heart,
  heartOutline,
  options,
  pricetagOutline,
  search,
  star,
  starOutline,
  timeOutline
} from 'ionicons/icons';

type SortId = 'popular' | 'rating' | 'fastest' | 'price';

interface SortOption {
  id: SortId;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon, BottomNavComponent]
})
export class MenuPage implements OnInit {
  foods: FoodItem[] = [];
  filteredFoods: FoodItem[] = [];
  selectedCategory = 'All';
  categories: string[] = ['All'];
  searchQuery = '';
  selectedSort: SortId = 'popular';
  favorites: Set<string> = new Set();
  recentlyAddedId: string | null = null;
  private recentlyAddedTimer: ReturnType<typeof setTimeout> | null = null;
  readonly sortOptions: SortOption[] = [
    { id: 'popular', label: 'Popular', icon: 'flame-outline' },
    { id: 'rating', label: 'Rating', icon: 'star-outline' },
    { id: 'fastest', label: 'Fastest', icon: 'time-outline' },
    { id: 'price', label: 'Price', icon: 'pricetag-outline' }
  ];

  constructor(
    private router: Router,
    private dataService: DataService,
    private cartService: CartService
  ) {
    addIcons({
      addIcon,
      arrowBack,
      cart,
      checkmark,
      flameOutline,
      heart,
      heartOutline,
      options,
      pricetagOutline,
      search,
      star,
      starOutline,
      timeOutline
    });
  }

  ngOnInit(): void {
    this.foods = this.dataService.getFoodItems();
    this.categories = ['All', ...this.dataService.getCategories()];
    this.filterFoods();
  }

  filterFoods(): void {
    let filtered = this.selectedCategory === 'All'
      ? [...this.foods]
      : this.dataService.getCategoryFoods(this.selectedCategory);

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        food =>
          food.name.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query) ||
          food.restaurantName.toLowerCase().includes(query)
      );
    }

    switch (this.selectedSort) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case 'fastest':
        filtered.sort((a, b) => a.prepTime - b.prepTime || a.price - b.price);
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price || b.rating - a.rating);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews || b.rating - a.rating);
        break;
    }

    this.filteredFoods = filtered;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterFoods();
  }

  selectSort(sortId: SortId): void {
    this.selectedSort = sortId;
    this.filterFoods();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedSort = 'popular';
    this.filterFoods();
  }

  getCategoryTone(category: string): string {
    const tones: Record<string, string> = {
      All: 'tone-all',
      Burgers: 'tone-burgers',
      Sushi: 'tone-sushi',
      Rolls: 'tone-sushi',
      Pizza: 'tone-pizza',
      Pasta: 'tone-pasta',
      Desserts: 'tone-desserts',
      Beverages: 'tone-drinks'
    };

    return tones[category] || 'tone-all';
  }

  getComparePrice(food: FoodItem): number {
    return Number((food.price + Math.max(2, food.prepTime / 4)).toFixed(2));
  }

  isFavorited(foodId: string): boolean {
    return this.favorites.has(foodId);
  }

  isPopular(foodId: string): boolean {
    const food = this.foods.find(item => item.id === foodId);
    return Boolean(food && food.reviews >= 200);
  }

  toggleFavorite(event: Event, foodId: string): void {
    event.stopPropagation();

    if (this.favorites.has(foodId)) {
      this.favorites.delete(foodId);
      return;
    }

    this.favorites.add(foodId);
  }

  handleImageError(event: Event, label: string): void {
    const image = event.target as HTMLImageElement | null;

    if (!image || image.dataset['fallbackApplied'] === 'true') {
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = this.getFallbackImage(label);
  }

  addToCart(food: FoodItem, event?: Event): void {
    event?.stopPropagation();
    this.cartService.addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1,
      image: food.image,
      restaurantId: food.restaurantId
    });

    this.recentlyAddedId = food.id;
    if (this.recentlyAddedTimer) {
      clearTimeout(this.recentlyAddedTimer);
    }
    this.recentlyAddedTimer = setTimeout(() => {
      this.recentlyAddedId = null;
      this.recentlyAddedTimer = null;
    }, 900);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  goToFoodDetail(foodId: string): void {
    this.router.navigate(['/food-detail', foodId]);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  private getFallbackImage(label: string): string {
    const shortLabel = label
      .split(' ')
      .slice(0, 2)
      .join(' ')
      .toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FF8E53"/>
            <stop offset="100%" stop-color="#FF5B2E"/>
          </linearGradient>
        </defs>
        <rect width="320" height="240" rx="24" fill="url(#g)"/>
        <circle cx="70" cy="60" r="28" fill="rgba(255,255,255,0.16)"/>
        <circle cx="256" cy="190" r="44" fill="rgba(255,255,255,0.12)"/>
        <text x="24" y="126" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="700">${shortLabel}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}
