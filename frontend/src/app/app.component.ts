import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { MaterialModule } from './shared/material.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
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
    FooterComponent,
    HomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isAuthRoute: boolean = false;
  isDashboardRoute: boolean = false;
  isHomeRoute: boolean = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAuthRoute = event.url.includes('/auth');
        this.isDashboardRoute = event.url.includes('/dashboard');
        this.isHomeRoute = event.url === '/';
      });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
