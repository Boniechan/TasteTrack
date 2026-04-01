import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Favorite {
  id: string;
  name: string;
  price: number;
  image: string;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Favorite[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const saved = localStorage.getItem('tastetrack_favorites');
    if (saved) {
      const favorites = JSON.parse(saved).map((f: any) => ({
        ...f,
        addedAt: new Date(f.addedAt)
      }));
      this.favoritesSubject.next(favorites);
    }
  }

  private saveFavorites(): void {
    localStorage.setItem('tastetrack_favorites', JSON.stringify(this.favoritesSubject.value));
  }

  addFavorite(favorite: Favorite): void {
    const favorites = this.favoritesSubject.value;
    if (!favorites.find(f => f.id === favorite.id)) {
      favorites.push(favorite);
      this.favoritesSubject.next(favorites);
      this.saveFavorites();
    }
  }

  removeFavorite(id: string): void {
    const favorites = this.favoritesSubject.value.filter(f => f.id !== id);
    this.favoritesSubject.next(favorites);
    this.saveFavorites();
  }

  isFavorite(id: string): boolean {
    return this.favoritesSubject.value.some(f => f.id === id);
  }

  getFavorites(): Favorite[] {
    return this.favoritesSubject.value;
  }
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    const saved = localStorage.getItem('tastetrack_notifications');
    if (saved) {
      const notifications = JSON.parse(saved).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
      this.notificationsSubject.next(notifications);
    }
  }

  private saveNotifications(): void {
    localStorage.setItem('tastetrack_notifications', JSON.stringify(this.notificationsSubject.value));
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const notifications = this.notificationsSubject.value;
    const newNotification: Notification = {
      ...notification,
      id: 'notif_' + Date.now(),
      timestamp: new Date()
    };
    notifications.unshift(newNotification);
    this.notificationsSubject.next(notifications);
    this.saveNotifications();
  }

  markAsRead(id: string): void {
    const notifications = this.notificationsSubject.value;
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.notificationsSubject.next([...notifications]);
      this.saveNotifications();
    }
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }
}
