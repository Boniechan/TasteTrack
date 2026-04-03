import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  chevronForwardOutline,
  colorPaletteOutline,
  documentOutline,
  documentTextOutline,
  fingerPrintOutline,
  helpCircleOutline,
  languageOutline,
  lockClosedOutline,
  moonOutline,
  paperPlaneOutline,
  pricetagOutline,
  receiptOutline,
  shieldCheckmarkOutline,
  shieldOutline,
  starOutline,
  trashOutline,
  volumeHighOutline
} from 'ionicons/icons';

interface AppSettingsState {
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  soundAlerts: boolean;
  biometric: boolean;
  language: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  darkMode = false;
  pushNotifications = true;
  orderUpdates = true;
  promotions = true;
  soundAlerts = true;
  biometric = false;
  language = 'english';
  readonly languageOptions = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Arabic'];

  private readonly storageKey = 'tastetrack_app_settings';

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    addIcons({
      arrowBackOutline,
      chevronForwardOutline,
      colorPaletteOutline,
      documentOutline,
      documentTextOutline,
      fingerPrintOutline,
      helpCircleOutline,
      languageOutline,
      lockClosedOutline,
      moonOutline,
      paperPlaneOutline,
      pricetagOutline,
      receiptOutline,
      shieldCheckmarkOutline,
      shieldOutline,
      starOutline,
      trashOutline,
      volumeHighOutline
    });
  }

  ngOnInit(): void {
    this.darkMode = this.userService.getUser()?.darkMode ?? document.documentElement.classList.contains('dark');
    this.loadSettings();
  }

  get themeDescription(): string {
    return this.darkMode ? 'Dark theme active' : 'Light theme active';
  }

  toggleDarkMode(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.darkMode = checked;
    this.userService.setDarkMode(checked);
  }

  togglePush(event: Event): void {
    this.pushNotifications = (event.target as HTMLInputElement).checked;
    this.saveSettings();
  }

  toggleOrderUpdates(event: Event): void {
    this.orderUpdates = (event.target as HTMLInputElement).checked;
    this.saveSettings();
  }

  togglePromotions(event: Event): void {
    this.promotions = (event.target as HTMLInputElement).checked;
    this.saveSettings();
  }

  toggleSound(event: Event): void {
    this.soundAlerts = (event.target as HTMLInputElement).checked;
    this.saveSettings();
  }

  toggleBiometric(event: Event): void {
    this.biometric = (event.target as HTMLInputElement).checked;
    this.saveSettings();
  }

  setLanguage(language: string): void {
    this.language = language.toLowerCase();
    this.saveSettings();
  }

  changePassword(): void {
    alert('Password change will be connected in a future update.');
  }

  openHelp(): void {
    this.router.navigate(['/about-us']);
  }

  rateApp(): void {
    alert('Rating flow will be connected in a future update.');
  }

  viewTerms(): void {
    alert('Terms of Service will be available in a future update.');
  }

  viewPrivacy(): void {
    alert('Privacy Policy will be available in a future update.');
  }

  deleteAccount(): void {
    if (confirm('Delete your account permanently? This cannot be undone.')) {
      localStorage.removeItem(this.storageKey);
      this.userService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  private loadSettings(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      return;
    }

    const settings = JSON.parse(saved) as Partial<AppSettingsState>;
    this.pushNotifications = settings.pushNotifications ?? this.pushNotifications;
    this.orderUpdates = settings.orderUpdates ?? this.orderUpdates;
    this.promotions = settings.promotions ?? this.promotions;
    this.soundAlerts = settings.soundAlerts ?? this.soundAlerts;
    this.biometric = settings.biometric ?? this.biometric;
    this.language = settings.language ?? this.language;
  }

  private saveSettings(): void {
    const settings: AppSettingsState = {
      pushNotifications: this.pushNotifications,
      orderUpdates: this.orderUpdates,
      promotions: this.promotions,
      soundAlerts: this.soundAlerts,
      biometric: this.biometric,
      language: this.language
    };

    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }
}
