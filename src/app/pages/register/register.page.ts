import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import {
  callOutline,
  eye,
  eyeOff,
  handLeftOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  sparklesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, ReactiveFormsModule]
})
export class RegisterPage {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
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
      'call-outline': callOutline,
      'hand-left-outline': handLeftOutline,
      'lock-closed-outline': lockClosedOutline,
      'mail-outline': mailOutline,
      'person-outline': personOutline,
      'sparkles-outline': sparklesOutline
    });

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {
    this.errorMessage = '';
    this.isLoading = true;
    const { email, password, name, phone } = this.registerForm.value;

    setTimeout(() => {
      this.userService.register(email, password, name, phone);
      this.router.navigate(['/home'], { replaceUrl: true });
      this.isLoading = false;
    }, 400);
  }

  goToLogin(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
