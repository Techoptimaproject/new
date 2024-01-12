import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PrimengModule } from './modules/primeng/primeng.module';
import { MaterialModule } from './modules/material/material.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SuccessPopupComponent } from './components/success-popup/success-popup.component';
import { ErrorPopupComponent } from './components/error-popup/error-popup.component';
import { CardHeaderComponent } from './components/card-header/card-header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    SuccessPopupComponent,
    ErrorPopupComponent,
    CardHeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    PrimengModule,
  ],
  exports: [
    PrimengModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CardHeaderComponent,
    FooterComponent,
  ],
})
export class SharedModule {}
