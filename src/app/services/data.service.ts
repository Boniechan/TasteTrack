import { Injectable } from '@angular/core';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  deliveryTime: number;
  minOrder: number;
  categories: string[];
  isOpen: boolean;
  description: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
  category: string;
  rating: number;
  reviews: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  prepTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly categoryAliases: Record<string, string[]> = {
    All: [],
    Burgers: ['Burgers'],
    Sushi: ['Sushi', 'Rolls', 'Nigiri'],
    Rolls: ['Rolls'],
    Nigiri: ['Nigiri'],
    Pizza: ['Pizza'],
    Pasta: ['Pasta'],
    Desserts: ['Desserts'],
    Beverages: ['Beverages']
  };

  private restaurants: Restaurant[] = [
    {
      id: 'burger-republic',
      name: 'Burger Republic',
      image: 'assets/Restaurant/Burger-Republic.jpg',
      rating: 4.8,
      reviews: 245,
      deliveryTime: 25,
      minOrder: 10,
      categories: ['Burgers', 'Fries', 'Shakes'],
      isOpen: true,
      description: 'Premium burgers with fresh ingredients'
    },
    {
      id: 'sakura-sushi',
      name: 'Sakura Sushi Bar',
      image: 'assets/Restaurant/Sakura-sushi-bar.jpg',
      rating: 4.9,
      reviews: 312,
      deliveryTime: 30,
      minOrder: 15,
      categories: ['Sushi', 'Rolls', 'Nigiri'],
      isOpen: true,
      description: 'Authentic Japanese sushi experience'
    },
    {
      id: 'napoli-pizza',
      name: 'Napoli Pizzeria',
      image: 'assets/Restaurant/Napoli-Pizzeria.jpg',
      rating: 4.7,
      reviews: 189,
      deliveryTime: 20,
      minOrder: 12,
      categories: ['Pizza', 'Pasta', 'Appetizers'],
      isOpen: true,
      description: 'Traditional Italian wood-fired pizzas'
    }
  ];

  private foodItems: FoodItem[] = [
    {
      id: 'classic-smash-burger',
      name: 'Classic Smash Burger',
      description: 'Perfectly smashed beef patty with lettuce, tomato, onion, and special sauce',
      price: 12.99,
      image: 'assets/food/Classic_Smashed.jpeg',
      restaurantId: 'burger-republic',
      restaurantName: 'Burger Republic',
      category: 'Burgers',
      rating: 4.8,
      reviews: 128,
      isVegetarian: false,
      isSpicy: false,
      prepTime: 12
    },
    {
      id: 'double-cheese-burger',
      name: 'Double Cheese Burger',
      description: 'Two beef patties with melted cheddar and special sauce',
      price: 14.99,
      image: 'assets/food/double-cheese.jpg',
      restaurantId: 'burger-republic',
      restaurantName: 'Burger Republic',
      category: 'Burgers',
      rating: 4.7,
      reviews: 95,
      isVegetarian: false,
      isSpicy: false,
      prepTime: 14
    },
    {
      id: 'premium-sushi-platter',
      name: 'Premium Sushi Platter',
      description: 'Assorted nigiri, rolls, and sashimi selection',
      price: 28.99,
      image: 'assets/food/Premium-Sushi.jpg',
      restaurantId: 'sakura-sushi',
      restaurantName: 'Sakura Sushi Bar',
      category: 'Sushi',
      rating: 4.9,
      reviews: 156,
      isVegetarian: false,
      isSpicy: false,
      prepTime: 15
    },
    {
      id: 'california-roll',
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber with sesame seeds',
      price: 10.99,
      image: 'assets/food/California-roll-.jpg',
      restaurantId: 'sakura-sushi',
      restaurantName: 'Sakura Sushi Bar',
      category: 'Rolls',
      rating: 4.8,
      reviews: 203,
      isVegetarian: false,
      isSpicy: false,
      prepTime: 10
    },
    {
      id: 'margherita-pizza',
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomato, basil, and olive oil',
      price: 16.99,
      image: 'assets/food/Margherita-Pizza.jpg',
      restaurantId: 'napoli-pizza',
      restaurantName: 'Napoli Pizzeria',
      category: 'Pizza',
      rating: 4.8,
      reviews: 234,
      isVegetarian: true,
      isSpicy: false,
      prepTime: 12
    },
    {
      id: 'pepperoni-pizza',
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni with extra cheese',
      price: 17.99,
      image: 'assets/food/Peperoni_Pizza.jpg',
      restaurantId: 'napoli-pizza',
      restaurantName: 'Napoli Pizzeria',
      category: 'Pizza',
      rating: 4.9,
      reviews: 312,
      isVegetarian: false,
      isSpicy: false,
      prepTime: 13
    },
    {
      id: 'creamy-truffle-pasta',
      name: 'Creamy Truffle Pasta',
      description: 'Fresh fettuccine with parmesan cream sauce, mushrooms, and black truffle',
      price: 18.99,
      image: 'assets/food/Creamy-truffle.jpg',
      restaurantId: 'napoli-pizza',
      restaurantName: 'Napoli Pizzeria',
      category: 'Pasta',
      rating: 4.8,
      reviews: 176,
      isVegetarian: true,
      isSpicy: false,
      prepTime: 16
    },
    {
      id: 'chocolate-lava-cake',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center and ice cream',
      price: 8.99,
      image: 'assets/food/Chocolate-lava.jpg',
      restaurantId: 'burger-republic',
      restaurantName: 'Burger Republic',
      category: 'Desserts',
      rating: 4.9,
      reviews: 267,
      isVegetarian: true,
      isSpicy: false,
      prepTime: 8
    },
    {
      id: 'tropical-acai-smoothie',
      name: 'Tropical Acai Smoothie',
      description: 'Acai, mango, pineapple, and coconut milk',
      price: 7.99,
      image: 'assets/food/tropical-acai.png',
      restaurantId: 'sakura-sushi',
      restaurantName: 'Sakura Sushi Bar',
      category: 'Beverages',
      rating: 4.7,
      reviews: 145,
      isVegetarian: true,
      isSpicy: false,
      prepTime: 5
    }
  ];

  constructor() {}

  getRestaurants(): Restaurant[] {
    return this.restaurants;
  }

  getRestaurant(id: string): Restaurant | undefined {
    return this.restaurants.find(r => r.id === id);
  }

  getFoodItems(): FoodItem[] {
    return this.foodItems;
  }

  getFoodItem(id: string): FoodItem | undefined {
    return this.foodItems.find(f => f.id === id);
  }

  getFoodByRestaurant(restaurantId: string): FoodItem[] {
    return this.foodItems.filter(f => f.restaurantId === restaurantId);
  }

  searchFood(query: string): FoodItem[] {
    const lower = query.toLowerCase();
    return this.foodItems.filter(f =>
      f.name.toLowerCase().includes(lower) ||
      f.description.toLowerCase().includes(lower) ||
      f.category.toLowerCase().includes(lower)
    );
  }

  getCategoryFoods(category: string): FoodItem[] {
    if (category === 'All') {
      return [...this.foodItems];
    }

    const allowedCategories = this.categoryAliases[category] ?? [category];
    return this.foodItems.filter(f => allowedCategories.includes(f.category));
  }

  getCategories(): string[] {
    return [...new Set(this.foodItems.map(f => f.category))];
  }

  getHomeCategories(): string[] {
    return ['All', 'Burgers', 'Pizza', 'Sushi', 'Pasta'];
  }

  getFeaturedFoods(category = 'All', limit = 4): FoodItem[] {
    return this.getCategoryFoods(category)
      .sort((a, b) => b.reviews - a.reviews || b.rating - a.rating)
      .slice(0, limit);
  }
}


