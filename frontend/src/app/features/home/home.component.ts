import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, NavigationEnd } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink, RouterModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isAuthRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthRoute = event.url.includes('/auth');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}