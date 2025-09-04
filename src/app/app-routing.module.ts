import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuardService } from './services';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: '',
    },
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'status-cuadratura',
        loadChildren: () =>
          import('./views/status-cuadratura/status-cuadratura.module').then(
            (m) => m.StatusCuadraturaModule
          ),
      },
      {
        path: 'tbk-registros/:tipo',
        loadChildren: () =>
          import('./views/tbk-registros/tbk-registros.module').then((m) => m.TbkRegistrosModule),
      },
      {
        path: 'liquidacion/:tipo',
        loadChildren: () =>
          import('./views/liquidaciones/liquidaciones.module').then((m) => m.LiquidacionModule),
      },
      {
        path: 'cartola-tbk/:tipo',
        loadChildren: () =>
          import('./views/cartola-tbk/cartola-tbk.module').then((m) => m.CartolaTbkModule),
      },
    ],
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Acceso al sistema',
    },
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
