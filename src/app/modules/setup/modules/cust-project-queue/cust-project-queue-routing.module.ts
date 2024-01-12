import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustProjectQueueComponent } from './components/cust-project-queue/cust-project-queue.component';
const routes: Routes = [
  {
    path: '',
    component: CustProjectQueueComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustProjectQueueRoutingModule {}
