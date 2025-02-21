import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-4 text-gray-600">Welcome to your dashboard!</p>
      </div>
    </div>
  `,
})
export class DashboardComponent {}
