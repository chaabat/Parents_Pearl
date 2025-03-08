import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { MaterialModule } from './shared/material.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';
import { HomeComponent } from './features/home/home.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule,
    NavbarComponent,
    
    HomeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isAuthRoute: boolean = false;
  isDashboardRoute: boolean = false;
  isHomeRoute: boolean = false;
  store: any;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAuthRoute = event.url.includes('/auth');
        this.isDashboardRoute = event.url.includes('/dashboard');
        this.isHomeRoute = event.url === '/';
      });
  }
  ngOnInit() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // Dispatch action to set authenticated state
      this.store.dispatch(AuthActions.loginSuccess({
        user: JSON.parse(user),
        token: token
      }));
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
