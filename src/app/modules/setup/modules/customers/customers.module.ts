import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomersService } from './services/customers.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule

  ],
  providers: [CustomersService]
})
export class CustomersModule { }
