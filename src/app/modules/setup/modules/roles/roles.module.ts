import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './components/roles/roles.component';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesService } from './services/roles.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolesListComponent } from '../roles/components/roles-list/roles-list.component';

@NgModule({
  declarations: [RolesComponent, RolesListComponent],
  imports: [CommonModule, RolesRoutingModule, SharedModule],
  providers: [RolesService],
})
export class RolesModule {}
