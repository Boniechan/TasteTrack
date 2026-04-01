import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { CartService } from '../../services/cart.service';
import { DataService, FoodItem } from '../../services/data.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, cartOutline, heart, heartOutline, star } from 'ionicons/icons';

interface FavoriteItem extends FoodItem {
  badge: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, BottomNavComponent],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favorites: FavoriteItem[] = [];

  private readonly storageKey = 'tastetrack_favorite_ids';
  private readonly defaultIds = [
    'classic-smash-burger',
    'premium-sushi-platter',
    'chocolate-lava-cake'
  ];

  constructor(
    private router: Router,
    private dataService: DataService,
    private cartService: CartService
  ) {
    addIcons({
      arrowBackOutline,
      cartOutline,
      heart,
      heartOutline,
      star
    });
  }

  ngOnInit(): void {
    this.loadFavorites();
  }

  ionViewWillEnter(): void {
    this.loadFavorites();
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  removeFavorite(id: string): void {
    this.favorites = this.favorites.filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites.map(item => item.id)));
  }

  addToCart(item: FavoriteItem): void {
    this.cartService.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      restaurantId: item.restaurantId
    });
  }

  private loadFavorites(): void {
    const savedIds = JSON.parse(localStorage.getItem(this.storageKey) || 'null') as string[] | null;
    const ids = savedIds?.length ? savedIds : this.defaultIds;

    this.favorites = ids
      .map(id => this.dataService.getFoodItem(id))
      .filter((item): item is FoodItem => !!item)
      .map(item => ({ ...item, badge: 'HOT' }));

    if (!savedIds) {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
    }
  }
}
