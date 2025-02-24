import { Routes } from '@angular/router';
import { ParentComponent } from './parent.component';

export const PARENT_ROUTES: Routes = [
  {
    path: '',
    component: ParentComponent,
    children: [
      {
        path: '',
        redirectTo: 'children',
        pathMatch: 'full'
      },
      {
        path: 'children',
        loadComponent: () => import('./children/children.component').then(m => m.ChildrenComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent)
      },
      {
        path: 'behavior',
        loadComponent: () => import('./behavior/behavior.component').then(m => m.BehaviorComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent)
      }
    ]
  }
];
