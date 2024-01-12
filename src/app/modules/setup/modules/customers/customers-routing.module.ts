import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';


const routes: Routes = [
  {
    path: '',
    
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CustomerComponent
      },
      {
        path: 'list',
       component: CustomerListComponent
      }
    ]
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CustomersRoutingModule { }
