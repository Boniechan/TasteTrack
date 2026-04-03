import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImage?: string;
  memberType: 'standard' | 'gold' | 'platinum';
  tastePoints: number;
  joinDate: Date;
  bio?: string;
  darkMode: boolean;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private addressesSubject = new BehaviorSubject<Address[]>([]);
  
  user$ = this.userSubject.asObservable();
  addresses$ = this.addressesSubject.asObservable();

  constructor() {
    this.loadUser();
    this.loadAddresses();
  }

  private createStaticUser(overrides: Partial<User> = {}): User {
    return {
      id: 'static-user',
      email: 'guest@tastetrack.app',
      name: 'TasteTrack Guest',
      phone: '+1 (555) 234-5678',
      memberType: 'gold',
      tastePoints: 1250,
      joinDate: new Date('2024-01-15'),
      darkMode: false,
      ...overrides
    };
  }

  private restoreStaticUser(overrides: Partial<User> = {}): void {
    const user = this.createStaticUser(overrides);
    this.userSubject.next(user);
    this.saveUser();
    this.applyDarkMode(user.darkMode);
  }

  private loadUser(): void {
    const saved = localStorage.getItem('tastetrack_user');
    if (saved) {
      const user = JSON.parse(saved);
      user.joinDate = new Date(user.joinDate);
      this.userSubject.next(user);
      this.applyDarkMode(user.darkMode);
      return;
    }

    this.applyDarkMode(false);
  }

  private saveUser(): void {
    const user = this.userSubject.value;
    if (user) {
      localStorage.setItem('tastetrack_user', JSON.stringify(user));
    }
  }

  private loadAddresses(): void {
    const saved = localStorage.getItem('tastetrack_addresses');
    if (saved) {
      this.addressesSubject.next(JSON.parse(saved));
    }
  }

  private saveAddresses(): void {
    localStorage.setItem('tastetrack_addresses', JSON.stringify(this.addressesSubject.value));
  }

  login(email: string, password: string): boolean {
    const trimmedEmail = email?.trim();
    const currentUser = this.userSubject.value;

    this.restoreStaticUser({
      email: trimmedEmail || currentUser?.email || 'guest@tastetrack.app',
      name: trimmedEmail ? trimmedEmail.split('@')[0] : currentUser?.name || 'TasteTrack Guest',
      phone: currentUser?.phone || '+1 (555) 234-5678',
      darkMode: currentUser?.darkMode ?? false
    });

    return true;
  }

  register(email: string, password: string, name: string, phone = ''): boolean {
    const currentUser = this.userSubject.value;

    this.restoreStaticUser({
      email: email?.trim() || currentUser?.email || 'guest@tastetrack.app',
      name: name?.trim() || currentUser?.name || 'TasteTrack Guest',
      phone: phone?.trim() || currentUser?.phone || '+1 (555) 234-5678',
      darkMode: currentUser?.darkMode ?? false
    });

    return true;
  }

  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem('tastetrack_user');
    this.applyDarkMode(false);
  }

  updateProfile(updates: Partial<User>): void {
    const user = this.userSubject.value;
    if (user) {
      const updated = { ...user, ...updates };
      this.userSubject.next(updated);
      this.saveUser();
      if (typeof updates.darkMode === 'boolean') {
        this.applyDarkMode(updates.darkMode);
      }
    }
  }

  toggleDarkMode(): void {
    const user = this.userSubject.value;
    if (user) {
      this.setDarkMode(!user.darkMode);
      return;
    }

    this.applyDarkMode(!document.documentElement.classList.contains('dark'));
  }

  setDarkMode(enabled: boolean): void {
    const user = this.userSubject.value;
    if (user) {
      user.darkMode = enabled;
      this.userSubject.next({ ...user });
      this.saveUser();
    }

    this.applyDarkMode(enabled);
  }

  addAddress(address: Address): void {
    const addresses = this.addressesSubject.value;
    address.id = 'addr_' + Date.now();
    addresses.push(address);
    this.addressesSubject.next(addresses);
    this.saveAddresses();
  }

  updateAddress(addressId: string, updates: Partial<Address>): void {
    const addresses = this.addressesSubject.value;
    const address = addresses.find(a => a.id === addressId);
    if (address) {
      Object.assign(address, updates);
      this.addressesSubject.next([...addresses]);
      this.saveAddresses();
    }
  }

  deleteAddress(addressId: string): void {
    const addresses = this.addressesSubject.value.filter(a => a.id !== addressId);
    this.addressesSubject.next(addresses);
    this.saveAddresses();
  }

  setDefaultAddress(addressId: string): void {
    const addresses = this.addressesSubject.value;
    addresses.forEach(a => a.isDefault = a.id === addressId);
    this.addressesSubject.next([...addresses]);
    this.saveAddresses();
  }

  getDefaultAddress(): Address | undefined {
    return this.addressesSubject.value.find(a => a.isDefault);
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  addTastePoints(points: number): void {
    const user = this.userSubject.value;
    if (user) {
      user.tastePoints += points;
      const orderValue = user.tastePoints;
      if (orderValue >= 2000) {
        user.memberType = 'platinum';
      } else if (orderValue >= 1000) {
        user.memberType = 'gold';
      }
      this.userSubject.next({ ...user });
      this.saveUser();
    }
  }

  private applyDarkMode(enabled: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle('dark', enabled);
    document.body.classList.toggle('dark', enabled);
  }
}
