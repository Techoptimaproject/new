import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueuesComponent } from './components/queues/queues.component';
import { MasterQueueComponent } from './components/master-queue/master-queue.component';
import { QueuesListComponent } from './components/queues-list/queues-list.component';

const routes: Routes = [
    {
        path: 'master',
        component: MasterQueueComponent
      },
      {
        path: 'list',
        component: QueuesListComponent
      },
      {
        path: 'new',
        component: QueuesComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'new'
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class QueuesRoutingModule { }
