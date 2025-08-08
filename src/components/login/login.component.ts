import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 animate-fade-in">
        <div class="card p-8">
          <div class="text-center">
            <div class="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p class="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  [(ngModel)]="credentials.username"
                  class="input-field"
                  placeholder="Enter your username"
                  [disabled]="isLoading"
                />
              </div>
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  [(ngModel)]="credentials.password"
                  class="input-field"
                  placeholder="Enter your password"
                  [disabled]="isLoading"
                />
              </div>
            </div>

            <div *ngIf="error" class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {{ error }}
            </div>

            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-blue-700 font-medium mb-2">Demo Credentials:</p>
              <div class="text-xs text-blue-600 space-y-1">
                <div>• admin / password</div>
                <div>• user / 123456</div>
                <div>• demo / demo</div>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full btn-primary flex justify-center items-center py-3 text-base"
            >
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/chat']);
        } else {
          this.error = 'Invalid username or password';
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Login failed. Please try again.';
      }
    });
  }
}