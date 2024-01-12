import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './components/forms/forms.component';
import { FormsRoutingModule } from './forms-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsListComponent } from './components/forms-list/forms-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormsComponent, FormsListComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class FormsModule {}
