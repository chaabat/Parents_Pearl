import { Routes } from '@angular/router';
import { ParentComponent } from './parent.component';
import { ParentResolver } from '../../core/resolvers/parent.resolver';

export const PARENT_ROUTES: Routes = [
  {
    path: '',
    component: ParentComponent,
    resolve: {
      children: ParentResolver,
    },
    children: [
      {
        path: 'children',
        loadComponent: () =>
          import('./children/children.component').then(
            (m) => m.ChildrenComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./tasks/tasks.component').then((m) => m.TasksComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./calendar/calendar.component').then(
            (m) => m.CalendarComponent
          ),
      },
      {
        path: '',
        redirectTo: 'children',
        pathMatch: 'full',
      },
    ],
  },
];
