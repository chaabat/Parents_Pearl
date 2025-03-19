import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule,  Router } from "@angular/router"
import { MaterialModule } from "../material.module"
import  { AuthService } from "../../core/services/auth.service"
import  { Child } from "../../core/models/child.model"
import  { Store } from "@ngrx/store"
import * as ChildSelectors from "../../store/child/child.selectors"
import { tap } from "rxjs/operators"
import { environment } from "../../../environments/environment"
import * as AuthSelectors from "../../store/auth/auth.selectors"
import * as AuthActions from "../../store/auth/auth.actions"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  user$ = this.store.select(AuthSelectors.selectUser)
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated)
  isAuthenticated = false
  user: Child | null = null
  totalPoints$ = this.store
    .select(ChildSelectors.selectTotalPoints)
    .pipe(tap((points) => console.log("Navbar - Current total points:", points)))
  defaultImage = "https://res.cloudinary.com/dlwyetxjd/image/upload/v1741258917/uulqrw1ytrup4txl8abb.png"

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuth) => (this.isAuthenticated = isAuth))

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user
        console.log("Current user:", user) // Debug log
      }
    })
  }

  getProfileImage(user: any): string {
    if (!user?.picture) {
      return this.defaultImage
    }

    // Check if the picture is already a full URL
    if (user.picture.startsWith("http")) {
      return user.picture
    }

    // Construct the full URL - remove the /api prefix if it's already in the environment.apiUrl
    const baseUrl = environment.apiUrl.endsWith("/api")
      ? environment.apiUrl.substring(0, environment.apiUrl.length - 4)
      : environment.apiUrl

    return `${baseUrl}/uploads/images/${user.picture}`
  }

  // Add an error handler for image loading failures
  onImageError(event: any): void {
    console.error("Failed to load profile image")
    event.target.src = this.defaultImage
  }

  logout() {
    this.store.dispatch(AuthActions.logout())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.router.navigate(["/auth/login"])
  }

  goToLogin() {
    this.router.navigate(["/auth/login"])
  }

  goToRegister() {
    this.router.navigate(["/auth/register"])
  }

  handleImageError(event: any) {
    event.target.style.display = "none"
    // Show icon instead
    const icon = event.target.nextElementSibling
    if (icon) {
      icon.style.display = "block"
    }
  }
}

