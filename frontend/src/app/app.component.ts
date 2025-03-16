import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { MaterialModule } from './shared/material.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';
import { HomeComponent } from './features/home/home.component';
import { filter } from 'rxjs/operators';
import * as ParentActions from './store/parent/parent.actions';

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
export class AppComponent implements OnInit {
  isAuthRoute: boolean = false;
  isDashboardRoute: boolean = false;
  isHomeRoute: boolean = false;

  constructor(private store: Store, private router: Router) {
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
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // Restore auth state
        this.store.dispatch(AuthActions.loginSuccess({ user, token }));
        // Load children data if on dashboard
        if (user.id) {
          this.store.dispatch(
            ParentActions.loadChildren({ parentId: user.id })
          );
        }
      } catch (e) {
        console.error('Error restoring session:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
