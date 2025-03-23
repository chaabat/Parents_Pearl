import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AuthService } from '../../core/services/auth.service';
import { Child } from '../../core/models/child.model';
import { Store } from '@ngrx/store';
import * as ChildSelectors from '../../store/child/child.selectors';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  user$ = this.store.select(AuthSelectors.selectUser);
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  isAuthenticated = false;
  user: Child | null = null;
  totalPoints$ = this.store
    .select(ChildSelectors.selectTotalPoints)
    .pipe(
      tap((points) => console.log('Navbar - Current total points:', points))
    );
  defaultImage =
    'https://res.cloudinary.com/dlwyetxjd/image/upload/v1742746619/hukxngslbjsopri1djvr.png';
  imageVersion = new Date().getTime();

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    // Use combineLatest instead of merge
    combineLatest([
      this.authService.currentUser$,
      this.store.select(AuthSelectors.selectUser),
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([user1, user2]) => !!user1 || !!user2)
      )
      .subscribe(([user1, user2]) => {
        this.user = user1 || user2;
        this.imageVersion = new Date().getTime();
      });

    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth) => (this.isAuthenticated = isAuth));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBackgroundImageStyle(user: any): string {
    const imageUrl = this.getProfileImage(user);
    return `url('${imageUrl}?v=${this.imageVersion}')`;
  }

  getProfileImage(user: any): string {
    if (!user?.picture) {
      return this.defaultImage;
    }

    // If it's a Cloudinary URL
    if (user.picture.startsWith('https://res.cloudinary.com')) {
      return user.picture;
    }

    // If it's already a full URL with our API
    if (user.picture.startsWith('http')) {
      // Extract just the filename from the full URL
      const parts = user.picture.split('/');
      return `${environment.apiUrl}/uploads/images/${parts[parts.length - 1]}`;
    }

    // If it's just the filename
    return `${environment.apiUrl}/uploads/images/${user.picture}`;
  }

  // Add an error handler for image loading failures
  onImageError(event: any): void {
    console.error('Failed to load profile image');
    event.target.src = this.defaultImage;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  handleImageError(event: any) {
    event.target.style.display = 'none';
    // Show icon instead
    const icon = event.target.nextElementSibling;
    if (icon) {
      icon.style.display = 'block';
    }
  }

  // Force refresh the image
  refreshImage() {
    this.imageVersion = new Date().getTime();
    // Also refresh from the backend
    this.store.dispatch(AuthActions.refreshUserProfile());
  }
}
