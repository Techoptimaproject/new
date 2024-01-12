import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueuesComponent } from './components/queues/queues.component';
import { MasterQueueComponent } from './components/master-queue/master-queue.component';
import { QueuesListComponent } from './components/queues-list/queues-list.component';
import { QueuesRoutingModule } from './queues-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    QueuesComponent,
    MasterQueueComponent,
    QueuesListComponent,
    
     
  ],
  imports: [
    CommonModule,
    QueuesRoutingModule,
    SharedModule,
    
  ]
})
export class QueuesModule { }
