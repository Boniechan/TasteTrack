import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchQuery: string = '';
  recentSearches: string[] = ['Burger', 'Pizza', 'Sushi', 'Chinese', 'Biryani'];
  searchResults: any[] = [];
  voiceSearchActive: boolean = false;

  constructor() {}

  ngOnInit() {}

  onSearch(event: any) {
    const query = event.detail?.value || this.searchQuery;
    if (query.length > 0) {
      this.performSearch(query);
    } else {
      this.searchResults = [];
    }
  }

  performSearch(query: string) {
    // Mock search results
    this.searchResults = [
      {
        id: 1,
        name: 'Burger Republic',
        cuisine: 'American Burgers',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
      },
      {
        id: 2,
        name: 'Sakura Sushi Bar',
        cuisine: 'Japanese Sushi',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
      }
    ];
  }

  toggleVoiceSearch() {
    this.voiceSearchActive = !this.voiceSearchActive;
    if (this.voiceSearchActive) {
      setTimeout(() => {
        this.voiceSearchActive = false;
      }, 2000);
    }
  }
}
