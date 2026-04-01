import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, FoodItem } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { addIcons } from 'ionicons';
import { arrowBack, heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.page.html',
  styleUrls: ['./food-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon]
})
export class FoodDetailPage implements OnInit {
  food: FoodItem | null = null;
  quantity = 1;
  isFavorite = false;
  specialInstructions = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {
    addIcons({ arrowBack, heart, heartOutline });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const food = this.dataService.getFoodItem(id);
      this.food = food || null;
      this.isFavorite = this.favoritesService.isFavorite(id);
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.food) {
      this.cartService.addItem({
        id: this.food.id,
        name: this.food.name,
        price: this.food.price,
        quantity: this.quantity,
        image: this.food.image,
        restaurantId: this.food.restaurantId,
        specialInstructions: this.specialInstructions || undefined
      });
      this.router.navigate(['/cart']);
    }
  }

  toggleFavorite(): void {
    if (this.food) {
      if (this.isFavorite) {
        this.favoritesService.removeFavorite(this.food.id);
      } else {
        this.favoritesService.addFavorite({
          id: this.food.id,
          name: this.food.name,
          price: this.food.price,
          image: this.food.image,
          addedAt: new Date()
        });
      }
      this.isFavorite = !this.isFavorite;
    }
  }

  goBack(): void {
    this.router.navigate(['/menu']);
  }
}
