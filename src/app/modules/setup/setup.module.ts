import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersModule } from './modules/users/users.module';
import { SetupRoutingModule } from './setup-routing.module';
// import { CustomersModule } from './modules/customers/customers.module';
import { FormsModule } from './modules/forms/forms.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { QueuesModule } from './modules/queues/queues.module';
import { RolesModule } from './modules/roles/roles.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomersModule } from './modules/customers/customers.module';
import { CustProjectQueueComponent } from './modules/cust-project-queue/components/cust-project-queue/cust-project-queue.component';

@NgModule({
  declarations: [
    CustProjectQueueComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    SharedModule,
    UsersModule,
    // CustomersModule,
    // CustomersModule,
    FormsModule,
    GroupsModule,
    ProjectsModule,
    QueuesModule,
    RolesModule,
  ],
})
export class SetupModule {}
