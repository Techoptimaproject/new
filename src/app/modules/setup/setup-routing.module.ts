import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('src/app/modules/setup/modules/users/users.module').then(
        (m) => m.UsersModule
      ),
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('src/app/modules/setup/modules/customers/customers.module').then(
        (m) => m.CustomersModule
      ),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('src/app/modules/setup/modules/forms/forms.module').then(
        (m) => m.FormsModule
      ),
  },
  {
    path: 'groups',
    loadChildren: () =>
      import('src/app/modules/setup/modules/groups/groups.module').then(
        (m) => m.GroupsModule
      ),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('src/app/modules/setup/modules/projects/projects.module').then(
        (m) => m.ProjectsModule
      ),
  },
  {
    path: 'queues',
    loadChildren: () =>
      import('src/app/modules/setup/modules/queues/queues.module').then(
        (m) => m.QueuesModule
      ),
  },
  {
    path: 'roles',
    loadChildren: () =>
      import('src/app/modules/setup/modules/roles/roles.module').then(
        (m) => m.RolesModule
      ),
  },
  {
    path: 'custProjectQueue',
    loadChildren: () =>
      import('src/app/modules/setup/modules/cust-project-queue/cust-project-queue.module').then(
        (m) => m.CustProjectQueueModule
      ),
  },
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
