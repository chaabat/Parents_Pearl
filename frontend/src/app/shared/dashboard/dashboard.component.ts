import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MaterialModule } from "../material.module"
import { RouterModule } from "@angular/router"
import { Store } from "@ngrx/store"
import { selectUser } from "../../store/auth/auth.selectors"
import { SidebarComponent } from "../sidebar/sidebar.component"
import { CustomDatePipe } from "../../pipe/date.pipe"
import { Chart, type ChartConfiguration, type ChartOptions, registerables } from "chart.js"
import { NgChartsModule } from "ng2-charts"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import * as ParentSelectors from "../../store/parent/parent.selectors"
import * as ChildSelectors from "../../store/child/child.selectors"

// Register all chart.js components
Chart.register(...registerables)

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    SidebarComponent,
    CustomDatePipe,
    NgChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  currentDate = new Date()
  userRole: string | undefined
  user$ = this.store.select(selectUser)
  user: any
  selectedDate: Date | null = new Date()
  children$ = this.store.select(ParentSelectors.selectChildren)
  childCount = 0
  totalPoints$ = this.store.select(ChildSelectors.selectTotalPoints)
  tasks$ = this.store.select(ParentSelectors.selectTasks)
  taskCount = 0
  completedTaskCount = 0
  pendingTaskCount = 0

  // Calendar events (example data)
  events = [
    { date: new Date(), title: "Team Meeting", color: "#4f46e5" },
    { date: new Date(Date.now() + 86400000), title: "Project Deadline", color: "#f59e0b" },
    { date: new Date(Date.now() + 172800000), title: "Review Session", color: "#10b981" },
    { date: new Date(Date.now() + 259200000), title: "Parent-Teacher Meeting", color: "#ef4444" },
    { date: new Date(Date.now() + 345600000), title: "Family Day", color: "#8b5cf6" },
  ]

  // Admin Charts
  userChartData: ChartConfiguration<"doughnut">["data"] = {
    labels: ["Parents", "Children", "Admins"],
    datasets: [
      {
        data: [65, 59, 10],
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(255, 206, 86, 0.8)"],
        hoverBackgroundColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)"],
      },
    ],
  }

  userChartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  }

  // Activity Chart
  activityChartData: ChartConfiguration<"line">["data"] = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Tasks Created",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Tasks Completed",
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
      },
    ],
  }

  activityChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  // Points Distribution Chart
  pointsChartData: ChartConfiguration<"bar">["data"] = {
    labels: ["Math", "Reading", "Science", "Art", "Sports", "Chores"],
    datasets: [
      {
        label: "Points Earned",
        data: [120, 190, 80, 50, 150, 210],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  pointsChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  // Recent activities
  recentActivities = [
    {
      type: "task_created",
      user: "John Parent",
      description: "Created a new Math task",
      time: "2 hours ago",
      icon: "assignment",
    },
    {
      type: "reward_added",
      user: "Sarah Parent",
      description: "Added a new reward: Movie Night",
      time: "3 hours ago",
      icon: "card_giftcard",
    },
    {
      type: "task_completed",
      user: "Emma Child",
      description: "Completed Science homework",
      time: "5 hours ago",
      icon: "check_circle",
    },
    {
      type: "points_earned",
      user: "Michael Child",
      description: "Earned 50 points for Reading",
      time: "1 day ago",
      icon: "stars",
    },
    {
      type: "reward_redeemed",
      user: "Oliver Child",
      description: "Redeemed reward: Ice Cream",
      time: "2 days ago",
      icon: "redeem",
    },
  ]

  // Achievements for children
  achievements = [
    { name: "First Task Completed", icon: "check_circle", unlocked: true, color: "#10b981" },
    { name: "5-Day Streak", icon: "local_fire_department", unlocked: true, color: "#f59e0b" },
    { name: "Math Master", icon: "calculate", unlocked: true, color: "#3b82f6" },
    { name: "100 Points Club", icon: "workspace_premium", unlocked: false, color: "#8b5cf6" },
    { name: "Reading Champion", icon: "menu_book", unlocked: false, color: "#ef4444" },
  ]

  constructor(private store: Store) {}

  ngOnInit() {
    this.user$.subscribe((user) => {
      this.user = user
      this.userRole = user?.role
      console.log("User role:", this.userRole)
    })

    // Get children count for parents
    this.children$.subscribe((children) => {
      this.childCount = children?.length || 0
    })

    // Get task statistics
    this.tasks$.subscribe((tasks) => {
      if (tasks) {
        this.taskCount = tasks.length
        this.completedTaskCount = tasks.filter((t) => t.status === "COMPLETED").length
        this.pendingTaskCount = tasks.filter((t) => t.status === "PENDING").length
      }
    })
  }

  // Calendar methods
  dateClass = (date: Date) => {
    const hasEvent = this.events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
    return hasEvent ? "event-date" : ""
  }

  onDateSelected(date: Date | null) {
    if (date) {
      this.selectedDate = date
    }
  }

  getEventsForDate(date: Date | null): any[] {
    if (!date) return []
    return this.events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Get color for event dot
  getEventColor(event: any): string {
    return event.color || "#4f46e5"
  }

  // Get progress percentage
  getProgressPercentage(completed: number, total: number): number {
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  // Get appropriate color for progress bar
  getProgressColor(percentage: number): string {
    if (percentage < 30) return "bg-red-500"
    if (percentage < 70) return "bg-yellow-500"
    return "bg-green-500"
  }
}

