import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/auth/auth.guard';
import { inject } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./pages/access-denied/access-denied.component').then((m) => m.AccessDeniedComponent),
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },

  {
    path: 'apicultura/apiarios',
    loadComponent: () =>
      import('./features/apiarios/apiarios-list.component').then((m) => m.ApiariosListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'apicultura/apiarios/novo',
    loadComponent: () =>
      import('./features/apiarios/apiarios-form.component').then((m) => m.ApiariosFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'apicultura/apiarios/:id/editar',
    loadComponent: () =>
      import('./features/apiarios/apiarios-form.component').then((m) => m.ApiariosFormComponent),
    canActivate: [authGuard],
  },

  {
    path: 'apicultura/colmeias',
    loadComponent: () =>
      import('./features/colmeias/colmeias-list.component').then((m) => m.ColmeiasListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'apicultura/colmeias/novo',
    loadComponent: () =>
      import('./features/colmeias/colmeias-form.component').then((m) => m.ColmeiasFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'apicultura/colmeias/:id/editar',
    loadComponent: () =>
      import('./features/colmeias/colmeias-form.component').then((m) => m.ColmeiasFormComponent),
    canActivate: [authGuard],
  },

  {
    path: 'apicultura/colheitas',
    loadComponent: () =>
      import('./features/colheitas/colheitas-list.component').then((m) => m.ColheitasListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'apicultura/colheitas/novo',
    loadComponent: () =>
      import('./features/colheitas/colheitas-form.component').then((m) => m.ColheitasFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'apicultura/colheitas/:id/editar',
    loadComponent: () =>
      import('./features/colheitas/colheitas-form.component').then((m) => m.ColheitasFormComponent),
    canActivate: [authGuard],
  },

  {
    path: 'admin/users',
    loadComponent: () =>
      import('./pages/admin/users-list.component').then((m) => m.UsersListComponent),
    canActivate: [authGuard, adminGuard],
  },

  {
    path: '',
    redirectTo: () => {
      const authService = inject(AuthService);
      return authService.isAuth() ? '/dashboard' : '/login';
    },
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: () => {
      const authService = inject(AuthService);
      return authService.isAuth() ? '/dashboard' : '/login';
    },
  },
];
