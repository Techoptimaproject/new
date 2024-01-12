import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HcfaClaimComponent } from './components/hcfa-claim/hcfa-claim.component';
import { UbClaimComponent } from './components/ub-claim/ub-claim.component';
import { AdaClaimComponent } from './components/ada-claim/ada-claim.component';
import { WebUplaodComponent } from './components/web-uplaod/web-uplaod.component';

const routes: Routes = [
  {
    path: 'hcfa',
    component: HcfaClaimComponent,
  },
  {
    path: 'ub',
    component: UbClaimComponent,
  },
  {
    path: 'ada',
    component: AdaClaimComponent,
  },
  {
    path: 'web',
    component: WebUplaodComponent,
  },
  {
    path: '',
    redirectTo: 'hcfa',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsRoutingModule {}
