import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HcfaClaimComponent } from './components/hcfa-claim/hcfa-claim.component';
import { ClaimsRoutingModule } from './claims-routing.module';
import { UbClaimComponent } from './components/ub-claim/ub-claim.component';
import { AdaClaimComponent } from './components/ada-claim/ada-claim.component';
import { WebUplaodComponent } from './components/web-uplaod/web-uplaod.component';



@NgModule({
  declarations: [
    HcfaClaimComponent,
    UbClaimComponent,
    AdaClaimComponent,
    WebUplaodComponent
  ],
  imports: [
    CommonModule,
    ClaimsRoutingModule,
    SharedModule
  ]
})
export class ClaimsModule { }
