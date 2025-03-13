import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AuthService } from '../../core/services/auth.service';
import { Child } from '../../core/models/child.model';
import { Store } from '@ngrx/store';
import * as ChildSelectors from '../../store/child/child.selectors';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  user: Child | null = null;
  totalPoints$ = this.store
    .select(ChildSelectors.selectTotalPoints)
    .pipe(
      tap((points) => console.log('Navbar - Current total points:', points))
    );
  defaultImage =
    'https://res.cloudinary.com/dlwyetxjd/image/upload/v1741258917/uulqrw1ytrup4txl8abb.png';

  constructor(
    private authService: AuthService,
    private store: Store // Add Store to constructor
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      (isAuth) => (this.isAuthenticated = isAuth)
    );

    this.authService.currentUser$.subscribe((user) => {
      if (user?.role === 'CHILD') {
        this.user = user as Child;
      } else {
        this.user = null;
      }
    });
  }

  getProfileImage(): string {
    return this.user?.picture || this.defaultImage;
  }

  logout() {
    this.authService.logout();
  }

  handleImageError(event: any) {
    event.target.style.display = 'none';
    // Show icon instead
    const icon = event.target.nextElementSibling;
    if (icon) {
      icon.style.display = 'block';
    }
  }
}
