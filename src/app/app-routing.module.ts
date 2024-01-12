import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('src/app/modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'setup',
    loadChildren: () =>
      import('src/app/modules/setup/setup.module').then((m) => m.SetupModule),
  },
  {
    path: 'claims',
    loadChildren: () =>
      import('src/app/modules/claims/claims.module').then((m) => m.ClaimsModule),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('src/app/modules/search/search.module').then((m) => m.SearchModule),
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
