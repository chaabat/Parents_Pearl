import { Component,  OnInit,  OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { MaterialModule } from "../material.module"
import  { Store } from "@ngrx/store"
import * as AuthSelectors from "../../store/auth/auth.selectors"
import * as ChildSelectors from "../../store/child/child.selectors"
import * as ChildActions from "../../store/child/child.actions"
import { SidebarComponent } from "../sidebar/sidebar.component"
import { NavbarComponent } from "../navbar/navbar.component"
import { CustomDatePipe } from "../../pipe/date.pipe"
import { Subscription } from "rxjs"
import { tap } from "rxjs/operators"
import { environment } from "../../../environments/environment"

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialModule, SidebarComponent, NavbarComponent, CustomDatePipe],
  templateUrl: "./main-layout.component.html",
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  currentDate = new Date()
  userRole: string | undefined
  user: any
  sidebarOpen = true
  totalPoints$ = this.store.select(ChildSelectors.selectTotalPoints).pipe(
    tap((points) => console.log("Current total points:", points)), // Debug log
  )
  private subscriptions = new Subscription()

  constructor(private store: Store) {
    // Initialize from localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      this.user = user
      this.userRole = user.role

      // Load points if user is a child
      if (user.role === "CHILD") {
        console.log("Dispatching loadPoints for child:", user.id) // Debug log
        this.store.dispatch(ChildActions.loadPoints({ childId: user.id }))
      }
    }
  }

  ngOnInit() {
    this.store.select(AuthSelectors.selectUser).subscribe((user) => {
      if (user) {
        this.user = user
        this.userRole = user.role

        if (user.role === "CHILD") {
          console.log("Loading child profile for:", user.id)
          this.store.dispatch(ChildActions.loadChildProfile({ childId: user.id }))
        }
      }
    })

    // Debug: Monitor profile state
    this.subscriptions.add(
      this.store.select(ChildSelectors.selectChildProfile).subscribe((profile) => {
        console.log("Current profile:", profile)
      }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen
  }

  handleImageError(event: any) {
    event.target.style.display = "none"
    // Show icon instead
    const icon = event.target.nextElementSibling
    if (icon) {
      icon.style.display = "block"
    }
  }

  // Update the getImageUrl method to use the correct path structure
  getImageUrl(picture: string | undefined | null): string {
    if (!picture) {
      return "https://res.cloudinary.com/dlwyetxjd/image/upload/v1741440913/qlmeun5wapfrgn5btfur.png"
    }

    // Check if the picture is already a full URL
    if (picture.startsWith("http")) {
      return picture
    }

    // Get the base URL without the /api suffix
    const baseUrl = environment.apiUrl.endsWith("/api")
      ? environment.apiUrl.substring(0, environment.apiUrl.length - 4)
      : environment.apiUrl

    // Return the full URL to the image
    return `${baseUrl}/uploads/images/${picture}`
  }
}

