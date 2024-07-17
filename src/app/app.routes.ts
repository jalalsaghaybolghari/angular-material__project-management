import { Routes } from '@angular/router';
import { LayoutComponent } from '@components/layout/layout.component';
import { LoignComponent } from '@components/loign/loign.component';
import { RegisterComponent } from '@components/register/register.component';
import { AuthGuard } from '@services/guards/auth.guard';
import { NoAuthGuard } from '@services/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        canActivate: [AuthGuard],
        path: 'project-list',
        loadComponent: () =>
          import('./components/projects/list/list.component').then(
            (c) => c.ProjectListComponent
          ),
      },
      {
        canActivate: [AuthGuard],
        path: 'add-project',
        loadComponent: () =>
          import('./components/projects/add/add.component').then(
            (c) => c.AddProjectComponent
          ),
      },
      {
        canActivate: [AuthGuard],
        path: 'add-task/:projectId',
        loadComponent: () =>
          import('./components/tasks/add/add.component').then(
            (c) => c.AddTaskComponent
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'task-list',
        loadComponent: () =>
          import('./components/tasks/list/list.component').then(
            (c) => c.TaskListComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LoignComponent,
  },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: RegisterComponent,
  },
];
