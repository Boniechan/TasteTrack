import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import {
  eye,
  eyeOff,
  lockClosedOutline,
  logoApple,
  logoFacebook,
  logoGoogle,
  mailOutline,
  restaurantOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, ReactiveFormsModule]
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    addIcons({
      eye,
      eyeOff,
      'lock-closed-outline': lockClosedOutline,
      'logo-apple': logoApple,
      'logo-facebook': logoFacebook,
      'logo-google': logoGoogle,
      'mail-outline': mailOutline,
      'restaurant-outline': restaurantOutline
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.errorMessage = '';
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    setTimeout(() => {
      this.userService.login(email, password);
      this.router.navigate(['/home'], { replaceUrl: true });
      this.isLoading = false;
    }, 400);
  }

  forgotPassword(): void {
    this.errorMessage = 'Password reset is not available yet.';
  }

  goToRegister(): void {
    this.router.navigate(['/register'], { replaceUrl: true });
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.userService.login('user@gmail.com', 'password');
      this.router.navigate(['/home'], { replaceUrl: true });
      this.isLoading = false;
    }, 400);
  }

  loginWithApple(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.userService.login('user@icloud.com', 'password');
      this.router.navigate(['/home'], { replaceUrl: true });
      this.isLoading = false;
    }, 400);
  }

  loginWithFacebook(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.userService.login('user@facebook.com', 'password');
      this.router.navigate(['/home'], { replaceUrl: true });
      this.isLoading = false;
    }, 400);
  }
}
