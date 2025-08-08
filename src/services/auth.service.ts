import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Dummy credentials
  private readonly DUMMY_CREDENTIALS = [
    { username: 'admin', password: 'password' },
    { username: 'user', password: '123456' },
    { username: 'demo', password: 'demo' }
  ];

  private readonly DUMMY_USER: User = {
    id: '1',
    username: 'admin',
    email: 'admin@chatapp.com',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150',
    isOnline: true
  };

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const isValid = this.DUMMY_CREDENTIALS.some(
          cred => cred.username === credentials.username && cred.password === credentials.password
        );

        if (isValid) {
          const user = { ...this.DUMMY_USER, username: credentials.username };
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000); // Simulate API delay
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}