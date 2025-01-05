import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { LoginComponent } from '../app/pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layout/default-layout/default-layout.component').then(
        (m) => m.DefaultLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./component/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./component/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'captains',
        loadComponent: () =>
          import('./component/captains/captains.component').then(
            (m) => m.CaptainsComponent
          ),
      },
    ],
  },

  //   children: [
  //     {
  //       path: 'dashboard',
  //       loadChildren: () =>
  //         import('./views/dashboard/routes').then((m) => m.routes),
  //     },
  //   {
  //     path: 'theme',
  //     loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
  //   },
  //   {
  //     path: 'base',
  //     loadChildren: () => import('./views/base/routes').then((m) => m.routes)
  //   },
  //   {
  //     path: 'buttons',
  //     loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
  //   },
  //   {
  //     path: 'forms',
  //     loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
  //   },
  //   {
  //     path: 'icons',
  //     loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
  //   },
  //   {
  //     path: 'notifications',
  //     loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
  //   },
  //   {
  //     path: 'widgets',
  //     loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
  //   },
  //   {
  //     path: 'charts',
  //     loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
  //   },
  //   {
  //     path: 'pages',
  //     loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
  //   }
  // ];
  //   },
  //   {
  //     path: '404',
  //     loadComponent: () =>
  //       import('./views/pages/page404/page404.component').then(
  //         (m) => m.Page404Component
  //       ),
  //     data: {
  //       title: 'Page 404',
  //     },
  //   },
  //   {
  //     path: '500',
  //     loadComponent: () =>
  //       import('./views/pages/page500/page500.component').then(
  //         (m) => m.Page500Component
  //       ),
  //     data: {
  //       title: 'Page 500',
  //     },
  //   },
  //   {
  //     path: 'login',
  //     loadComponent: () =>
  //       import('./views/pages/login/login.component').then(
  //         (m) => m.LoginComponent
  //       ),
  //     data: {
  //       title: 'Login Page',
  //     },
  //   },
  //   {
  //     path: 'register',
  //     loadComponent: () =>
  //       import('./views/pages/register/register.component').then(
  //         (m) => m.RegisterComponent
  //       ),
  //     data: {
  //       title: 'Register Page',
  //     },
  //   },
  //   { path: '**', redirectTo: 'dashboard' },
  // ];
];
