import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login').then((m) => m.LoginPage),
    canActivate: [loginGuard],
    title: 'Sign in · Pulse',
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('../pages/all/all').then((m) => m.AllPage),
    canActivate: [authGuard],
    title: 'Pulse',
  },
  {
    path: 'p/:slug',
    loadComponent: () => import('../pages/project/project').then((m) => m.ProjectPage),
    canActivate: [authGuard],
    title: 'Project · Pulse',
  },
  {
    path: 'prospects',
    loadComponent: () => import('../pages/prospects/prospects').then((m) => m.ProspectsPage),
    canActivate: [authGuard],
    title: 'Prospects · Pulse',
  },
  {
    path: 'costs',
    loadComponent: () => import('../pages/costs/costs').then((m) => m.CostsPage),
    canActivate: [authGuard],
    title: 'Costs · Pulse',
  },
  {
    path: 'deploys',
    loadComponent: () => import('../pages/deploys/deploys').then((m) => m.DeploysPage),
    canActivate: [authGuard],
    title: 'Deploys · Pulse',
  },
  {
    path: 'settings',
    loadComponent: () => import('../pages/settings/settings').then((m) => m.SettingsPage),
    canActivate: [authGuard],
    title: 'Settings · Pulse',
  },
  {
    // Public, read-only client card. No guard, no shell (contract §3).
    path: 'view/:token',
    loadComponent: () => import('../pages/client-view/client-view').then((m) => m.ClientViewPage),
    title: 'Site status',
  },
  {
    path: '**',
    loadComponent: () => import('../pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: 'Not found · Pulse',
  },
];
