import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="parent-dashboard">
      <router-outlet></router-outlet>
    </div>
  `
})
export class ParentComponent {}

export default ParentComponent; 