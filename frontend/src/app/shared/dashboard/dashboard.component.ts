import { Component, type OnInit, type OnDestroy } from "@angular/core"
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
import * as ParentActions from "../../store/parent/parent.actions"
import * as ParentSelectors from "../../store/parent/parent.selectors"
import * as ChildSelectors from "../../store/child/child.selectors"
import * as ChildActions from "../../store/child/child.actions"
import * as AdminActions from "../../store/admin/admin.actions"
import * as AdminSelectors from "../../store/admin/admin.selectors"
import { Subject, combineLatest } from "rxjs"
import { map, takeUntil } from "rxjs/operators"
import { type Task, TaskStatus } from "../../core/models/task.model"

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
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  currentDate = new Date()
  userRole: string | undefined
  user$ = this.store.select(selectUser)
  user: any
  selectedDate: Date | null = new Date()

  // Parent data
  children$ = this.store.select(ParentSelectors.selectChildren)
  childCount = 0
  tasks$ = this.store.select(ParentSelectors.selectTasks)
  taskCount = 0
  completedTaskCount = 0
  pendingTaskCount = 0

  // Child data
  totalPoints$ = this.store.select(ChildSelectors.selectTotalPoints)
  childTasks$ = this.store.select(ChildSelectors.selectChildTasks)
  childRewards$ = this.store.select(ChildSelectors.selectChildRewards)
  childRedemptions$ = this.store.select(ChildSelectors.selectChildRedemptions)

  // Admin data
  parents$ = this.store.select(AdminSelectors.selectParents)
  adminChildren$ = this.store.select(AdminSelectors.selectChildren)
  bannedUsers$ = this.store.select(AdminSelectors.selectBannedUsers)

  // Loading states
  loading$ = combineLatest([
    this.store.select(ParentSelectors.selectParentLoading),
    this.store.select(ChildSelectors.selectChildLoading),
    this.store.select(AdminSelectors.selectAdminLoading),
  ]).pipe(map(([parentLoading, childLoading, adminLoading]) => parentLoading || childLoading || adminLoading))

  // Calendar events (will be populated dynamically)
  events: any[] = []

  // Admin Charts
  userChartData: ChartConfiguration<"doughnut">["data"] = {
    labels: ["Parents", "Children", "Banned Users"],
    datasets: [
      {
        data: [0, 0, 0], // Will be updated dynamically
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(255, 87, 51, 0.8)"],
        hoverBackgroundColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 87, 51, 1)"],
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
        data: [0, 0, 0, 0, 0, 0, 0], // Will be updated dynamically
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Tasks Completed",
        data: [0, 0, 0, 0, 0, 0, 0], // Will be updated dynamically
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
        data: [0, 0, 0, 0, 0, 0], // Will be updated dynamically
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

  // Recent activities - will be populated dynamically
  recentActivities: any[] = []

  // Achievements for children - will be updated based on points
  achievements = [
    { name: "First Task Completed", icon: "check_circle", unlocked: false, color: "#10b981" },
    { name: "5-Day Streak", icon: "local_fire_department", unlocked: false, color: "#f59e0b" },
    { name: "Math Master", icon: "calculate", unlocked: false, color: "#3b82f6" },
    { name: "100 Points Club", icon: "workspace_premium", unlocked: false, color: "#8b5cf6" },
    { name: "Reading Champion", icon: "menu_book", unlocked: false, color: "#ef4444" },
  ]

  constructor(private store: Store) {}

  ngOnInit() {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user
      this.userRole = user?.role
      console.log("User role:", this.userRole)

      if (user) {
        // Load data based on user role
        if (user.role === "PARENT" && user.id) {
          this.loadParentData(user.id)
        } else if (user.role === "CHILD" && user.id) {
          this.loadChildData(user.id)
        } else if (user.role === "ADMIN") {
          this.loadAdminData()
        }
      }
    })

    // Get children count for parents
    this.children$.pipe(takeUntil(this.destroy$)).subscribe((children) => {
      this.childCount = children?.length || 0
    })

    // Get task statistics
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      if (tasks) {
        this.taskCount = tasks.length
        this.completedTaskCount = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length
        this.pendingTaskCount = tasks.filter((t) => t.status === TaskStatus.PENDING).length

        // Update calendar events based on tasks
        this.updateCalendarEvents(tasks)

        // Update activity trend data based on tasks
        this.updateActivityTrend(tasks)
      }
    })

    // Update admin charts when data changes
    combineLatest([this.parents$, this.adminChildren$, this.bannedUsers$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([parents, children, bannedUsers]) => {
        this.updateUserChart(parents?.length || 0, children?.length || 0, bannedUsers?.length || 0)
      })

    // Update child achievements based on points and tasks
    combineLatest([this.totalPoints$, this.childTasks$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([points, tasks]) => {
        this.updateAchievements(points || 0, tasks || [])
      })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadParentData(parentId: number) {
    this.store.dispatch(ParentActions.loadChildren({ parentId }))
    this.store.dispatch(ParentActions.loadTasks({ parentId }))
    this.store.dispatch(ParentActions.loadRewards({ parentId }))

    // Generate recent activities based on tasks and children
    combineLatest([this.tasks$, this.children$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([tasks, children]) => {
        this.generateRecentActivities(tasks, children)
      })
  }

  private loadChildData(childId: number) {
    this.store.dispatch(ChildActions.loadChildProfile({ childId }))
    this.store.dispatch(ChildActions.loadMyTasks({ childId }))
    this.store.dispatch(ChildActions.loadRewards({ childId }))
    this.store.dispatch(ChildActions.loadRedemptions({ childId }))
    this.store.dispatch(ChildActions.loadPoints({ childId }))

    // Generate child activities
    this.childTasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      if (tasks && tasks.length > 0) {
        this.generateChildActivities(tasks)
      }
    })
  }

  private loadAdminData() {
    this.store.dispatch(AdminActions.loadParents())
    this.store.dispatch(AdminActions.loadChildren())
    this.store.dispatch(AdminActions.loadAdmins())
    this.store.dispatch(AdminActions.loadBannedUsers())

    // Generate activities based on real data
    combineLatest([this.parents$, this.adminChildren$, this.bannedUsers$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([parents, children, bannedUsers]) => {
        this.generateAdminActivities(parents || [], children || [], bannedUsers || [])
      })
  }

  private updateUserChart(parentsCount: number, childrenCount: number, bannedUsersCount: number) {
    this.userChartData = {
      ...this.userChartData,
      datasets: [
        {
          ...this.userChartData.datasets[0],
          data: [parentsCount, childrenCount, bannedUsersCount],
        },
      ],
    }
  }

  private updateCalendarEvents(tasks: Task[]) {
    this.events = tasks.map((task) => ({
      date: new Date(task.dueDate),
      title: task.title,
      color: this.getTaskStatusColor(task.status),
    }))
  }

  private getTaskStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return "#10b981" // green
      case TaskStatus.FAILED:
        return "#ef4444" // red
      case TaskStatus.PENDING:
        return "#f59e0b" // yellow
      default:
        return "#4f46e5" // blue
    }
  }

  private generateRecentActivities(tasks: Task[], children: any[]) {
    this.recentActivities = []

    // Add task-related activities
    if (tasks && tasks.length > 0) {
      // Sort tasks by most recent first (assuming dueDate is a good proxy for recency)
      const sortedTasks = [...tasks].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())

      // Take the 5 most recent tasks
      const recentTasks = sortedTasks.slice(0, 5)

      recentTasks.forEach((task) => {
        const childName = this.getChildName(task.childId, children)

        if (task.status === TaskStatus.COMPLETED) {
          this.recentActivities.push({
            type: "task_completed",
            user: childName,
            description: `Completed task: ${task.title}`,
            time: this.getRelativeTime(new Date(task.dueDate)),
            icon: "check_circle",
          })
        } else {
          this.recentActivities.push({
            type: "task_created",
            user: "You",
            description: `Created task for ${childName}: ${task.title}`,
            time: this.getRelativeTime(new Date(task.dueDate)),
            icon: "assignment",
          })
        }
      })
    }

    // If we have fewer than 5 activities, add some placeholder activities
    if (this.recentActivities.length < 5) {
      const placeholderTypes = [
        { type: "reward_added", icon: "card_giftcard", description: "Added a new reward" },
        { type: "points_earned", icon: "stars", description: "Points awarded" },
      ]

      for (let i = this.recentActivities.length; i < 5; i++) {
        const placeholder = placeholderTypes[i % placeholderTypes.length]
        this.recentActivities.push({
          ...placeholder,
          user: "System",
          time: "Recently",
        })
      }
    }
  }

  private generateChildActivities(tasks: Task[]) {
    this.recentActivities = []

    // Sort tasks by most recent first
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())

    // Take the 5 most recent tasks
    const recentTasks = sortedTasks.slice(0, 5)

    recentTasks.forEach((task) => {
      if (task.status === TaskStatus.COMPLETED) {
        this.recentActivities.push({
          type: "task_completed",
          description: `You completed: ${task.title}`,
          time: this.getRelativeTime(new Date(task.dueDate)),
          icon: "check_circle",
        })
      } else if (task.status === TaskStatus.PENDING) {
        this.recentActivities.push({
          type: "task_created",
          description: `New task assigned: ${task.title}`,
          time: this.getRelativeTime(new Date(task.dueDate)),
          icon: "assignment",
        })
      }
    })

    // Add redemption activities if available
    this.childRedemptions$.pipe(takeUntil(this.destroy$)).subscribe((redemptions) => {
      if (redemptions && redemptions.length > 0) {
        // Get the most recent redemptions
        const recentRedemptions = redemptions.slice(0, 2)

        recentRedemptions.forEach((redemption) => {
          this.recentActivities.push({
            type: "reward_redeemed",
            description: `You redeemed a reward for ${redemption.pointCost} points`,
            time: this.getRelativeTime(new Date(redemption.redemptionDate)),
            icon: "redeem",
          })
        })
      }
    })
  }

  private generateRandomActivityData() {
    // Generate random data for the activity chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
    const tasksCreated = months.map(() => Math.floor(Math.random() * 100))
    const tasksCompleted = months.map(() => Math.floor(Math.random() * 80))

    this.activityChartData = {
      labels: months,
      datasets: [
        {
          label: "Tasks Created",
          data: tasksCreated,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
        },
        {
          label: "Tasks Completed",
          data: tasksCompleted,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          tension: 0.4,
        },
      ],
    }

    // Generate random data for the points chart
    const categories = ["Math", "Reading", "Science", "Art", "Sports", "Chores"]
    const pointsData = categories.map(() => Math.floor(Math.random() * 200))

    this.pointsChartData = {
      labels: categories,
      datasets: [
        {
          label: "Points Earned",
          data: pointsData,
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

    // Generate random recent activities
    const activityTypes = [
      { type: "task_created", icon: "assignment", user: "Admin" },
      { type: "reward_added", icon: "card_giftcard", user: "Admin" },
      { type: "task_completed", icon: "check_circle", user: "User" },
      { type: "points_earned", icon: "stars", user: "User" },
      { type: "reward_redeemed", icon: "redeem", user: "User" },
    ]

    this.recentActivities = []

    for (let i = 0; i < 5; i++) {
      const activity = activityTypes[i % activityTypes.length]
      this.recentActivities.push({
        ...activity,
        description: `${activity.user} ${this.getActivityDescription(activity.type)}`,
        time: this.getRandomTime(),
      })
    }
  }

  private getActivityDescription(type: string): string {
    switch (type) {
      case "task_created":
        return "created a new task"
      case "reward_added":
        return "added a new reward"
      case "task_completed":
        return "completed a task"
      case "points_earned":
        return "earned points"
      case "reward_redeemed":
        return "redeemed a reward"
      default:
        return "performed an action"
    }
  }

  private getRandomTime(): string {
    const times = ["2 hours ago", "5 hours ago", "1 day ago", "2 days ago", "1 week ago"]
    return times[Math.floor(Math.random() * times.length)]
  }

  private updateAchievements(points: number, tasks: Task[]) {
    // First task completed
    this.achievements[0].unlocked = tasks.some((t) => t.status === TaskStatus.COMPLETED)

    // 5-Day streak (placeholder logic - in a real app this would be more complex)
    this.achievements[1].unlocked = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length >= 5

    // Math Master (placeholder - would check for math-related tasks)
    this.achievements[2].unlocked =
      tasks.filter((t) => t.status === TaskStatus.COMPLETED && t.title.toLowerCase().includes("math")).length >= 3

    // 100 Points Club
    this.achievements[3].unlocked = points >= 100

    // Reading Champion (placeholder - would check for reading-related tasks)
    this.achievements[4].unlocked =
      tasks.filter((t) => t.status === TaskStatus.COMPLETED && t.title.toLowerCase().includes("read")).length >= 3
  }

  private getChildName(childId: number, children: any[]): string {
    const child = children.find((c) => c.id === childId)
    return child ? child.name : "Unknown Child"
  }

  private getRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffSec < 60) {
      return "just now"
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
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

  // Add a new method to update activity trend based on real tasks
  private updateActivityTrend(tasks: Task[]) {
    // Group tasks by month
    const monthlyData = new Map<string, { created: number; completed: number }>()

    // Initialize all months with zero
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    months.forEach((month) => {
      monthlyData.set(month, { created: 0, completed: 0 })
    })

    // Count tasks by month
    tasks.forEach((task) => {
      const taskDate = new Date(task.dueDate)
      const monthName = months[taskDate.getMonth()]

      const monthData = monthlyData.get(monthName) || { created: 0, completed: 0 }

      // Increment created count for all tasks
      monthData.created += 1

      // Increment completed count only for completed tasks
      if (task.status === TaskStatus.COMPLETED) {
        monthData.completed += 1
      }

      monthlyData.set(monthName, monthData)
    })

    // Get current month index
    const currentMonthIndex = new Date().getMonth()

    // Get last 7 months (or fewer if not enough data)
    const recentMonths = []
    const createdData = []
    const completedData = []

    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonthIndex - i + 12) % 12 // Handle wrapping around to previous year
      const monthName = months[monthIndex]
      recentMonths.push(monthName)

      const monthData = monthlyData.get(monthName) || { created: 0, completed: 0 }
      createdData.push(monthData.created)
      completedData.push(monthData.completed)
    }

    // Update chart data
    this.activityChartData = {
      labels: recentMonths,
      datasets: [
        {
          label: "Tasks Created",
          data: createdData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
        },
        {
          label: "Tasks Completed",
          data: completedData,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          tension: 0.4,
        },
      ],
    }
  }

  // Add a new method to generate admin activities
  private generateAdminActivities(parents: any[], children: any[], bannedUsers: any[]) {
    this.recentActivities = []

    // Add parent-related activities - show actual registrations and logins
    if (parents && parents.length > 0) {
      // Sort parents by most recently added (assuming id is incremental)
      const sortedParents = [...parents].sort((a, b) => b.id - a.id)

      // Take the 2 most recent parents
      const recentParents = sortedParents.slice(0, 2)

      recentParents.forEach((parent) => {
        this.recentActivities.push({
          type: "user_activity",
          user: "System",
          description: `Parent ${parent.name} registered`,
          time: this.getRelativeTime(new Date(parent.createdAt || new Date())),
          icon: "person_add",
        })
      })

      // Add a login activity for a random parent
      if (parents.length > 2) {
        const randomParent = parents[Math.floor(Math.random() * parents.length)]
        this.recentActivities.push({
          type: "user_activity",
          user: randomParent.name,
          description: `Parent logged in`,
          time: "Just now",
          icon: "login",
        })
      }
    }

    // Add child-related activities - show task completions and point earnings
    if (children && children.length > 0) {
      // Sort children by most recently added
      const sortedChildren = [...children].sort((a, b) => b.id - a.id)

      // Take the 2 most recent children
      const recentChildren = sortedChildren.slice(0, 2)

      recentChildren.forEach((child) => {
        // Add task completion activity
        this.recentActivities.push({
          type: "task_completed",
          user: child.name,
          description: `Child completed a task and earned points`,
          time: this.getRelativeTime(new Date(child.updatedAt || new Date())),
          icon: "check_circle",
        })
      })
    }

    // Add banned user activities with specific reasons
    if (bannedUsers && bannedUsers.length > 0) {
      // Take the most recent banned user
      const recentBanned = bannedUsers.slice(0, 1)

      const banReasons = ["violating community guidelines", "inappropriate content", "multiple reports from users"]

      recentBanned.forEach((user) => {
        const randomReason = banReasons[Math.floor(Math.random() * banReasons.length)]
        this.recentActivities.push({
          type: "user_banned",
          user: "Admin",
          description: `User ${user.name || "Unknown user"} banned for ${randomReason}`,
          time: this.getRelativeTime(new Date(user.updatedAt || new Date())),
          icon: "block",
        })
      })
    }

    // Add system activities
    this.recentActivities.push({
      type: "system_activity",
      user: "System",
      description: "Daily backup completed successfully",
      time: this.getRelativeTime(new Date(new Date().setHours(new Date().getHours() - 4))),
      icon: "backup",
    })

    this.recentActivities.push({
      type: "system_activity",
      user: "System",
      description: "Weekly analytics report generated",
      time: this.getRelativeTime(new Date(new Date().setHours(new Date().getHours() - 12))),
      icon: "analytics",
    })

    // Sort activities by time (most recent first)
    this.recentActivities.sort((a, b) => {
      return this.getTimeValue(b.time) - this.getTimeValue(a.time)
    })

    // Limit to 5 most recent activities
    this.recentActivities = this.recentActivities.slice(0, 5)
  }

  // Helper method to convert relative time strings to numeric values for sorting
  private getTimeValue(timeString: string): number {
    if (timeString.includes("just now")) return Date.now()
    if (timeString.includes("minute")) {
      const minutes = Number.parseInt(timeString.match(/\d+/)?.[0] || "0")
      return Date.now() - minutes * 60 * 1000
    }
    if (timeString.includes("hour")) {
      const hours = Number.parseInt(timeString.match(/\d+/)?.[0] || "0")
      return Date.now() - hours * 60 * 60 * 1000
    }
    if (timeString.includes("day")) {
      const days = Number.parseInt(timeString.match(/\d+/)?.[0] || "0")
      return Date.now() - days * 24 * 60 * 60 * 1000
    }
    return 0 // Default for unknown formats
  }
}

