import { Component } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PrimengTable } from 'src/app/shared/models/primeng-table.model';
import { Forms } from '../../models/forms.model';
import { FormsService } from '../../services/forms.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from 'src/app/shared/components/success-popup/success-popup.component';
import { StandardResponse } from 'src/app/shared/models/standard-response.model';
import { ErrorPopupComponent } from 'src/app/shared/components/error-popup/error-popup.component';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent {
  forms: FormGroup;
  form: Forms[] = [];
  formList: Forms[] = [];
  originalFormList: Forms[] = [];
  destroyed$ = new Subject();
  searchText: string = '';
  selectedFileName: string = '';
  isNewForm = false;
  isEditForm = false;
  errorMessage: string = '';

  submitted = false;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private formservice: FormsService // private snackBar: MatSnackBar
  ) {
    this.forms = this.fb.group({
      formId: [''],
      formName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      formCode: ['', [Validators.required]],
      status: ['Active'],
      documentsUpload: [''],
    });
  }
  addForm(): void {
    this.forms.reset({ status: 'Active' });
    this.isNewForm = true;
    this.isEditForm = false;
  }
  ngOnInit(): void {
    this.getFormList();
  }

  filterForms(): void {
    const searchTextLower = this.searchText.toLowerCase();

    if (!this.searchText) {
      this.formList = [...this.originalFormList];
    } else {
      this.formList = this.originalFormList.filter(
        (f) =>
          f.formName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.formCode.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.status.toString().toLowerCase() === searchTextLower ||
          f.documentsUpload.toString().toLowerCase() === searchTextLower
      );
    }
  }

  private getFormList(): void {
    this.formservice
      .getform()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((item) => {
        this.originalFormList = item.data;
        this.formList = item.data;
      });
  }

  editForm(selectedForm: Forms): void {
    // Set the form values
    if (selectedForm.option === 'edit') {
      this.isEditForm = true;
      this.isNewForm = false;
      this.forms.setValue({
        formId: selectedForm.formId,
        formName: selectedForm.formName,
        formCode: selectedForm.formCode,
        status: selectedForm.status,
        documentsUpload: selectedForm.documentsUpload,
      });
      console.log(selectedForm);
    }

    if (selectedForm.option === 'delete') {
      this.isEditForm = false;
      this.isNewForm = false;

      const finaldata: any = {
        formId: selectedForm.formId,
        formName: selectedForm.formName,
        formCode: selectedForm.formCode,
        status: selectedForm.status,
        documentsUpload: selectedForm.documentsUpload,
        isDeleted: true,
      };
      this.formservice
        .updateform(finaldata)
        .pipe(
          filter((response) => !!response),
          takeUntil(this.destroyed$)
        )
        .subscribe((response) => {
          this.openDialog(
            response.statusCode,
            response.message,
            response.errors,
            () => {
              if (response.statusCode === 200) {
                this.resetAndReloadGrid();
              }
            }
          );
        });
    }
  }

  onCancel(): void {
    this.forms.reset({ status: 'Active' });
    this.isEditForm = false;
    this.isNewForm = false;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedFileName = file ? file.name : '';
    }
  }

  onSubmit() {
    Object.keys(this.forms.controls).forEach((field) => {
      const control = this.forms.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
    const formData = this.forms.value;
    if (this.forms.invalid) {
      this.errorMessage = 'Form is invalid. Please fill above required fields.';
      return;
    } else {
      console.log('Form is valid and submitted.');
      this.errorMessage = '';
    }

    const file: File = formData.documentsUpload;
    const fileName = file ? file.name : ''; // Extracts only the file name

    if (this.isEditForm) {
      var finaldata: any = {
        formId: formData.formId,
        formName: formData.formName,
        formCode: formData.formCode,
        documentsUpload: this.selectedFileName,
        status: formData.status,
        isDeleted: false,
        // createdBy: 'superuser',
      };

      this.formservice
        .updateform(finaldata)
        .pipe(
          filter((response) => !!response),
          takeUntil(this.destroyed$)
        )
        .subscribe((response) => {
          this.openDialog(
            response.statusCode,
            response.message,
            response.errors,
            () => {
              if (response.statusCode === 200) {
                this.resetAndReloadGrid();
              }
            }
          );
        });
    } else {
      var finaldata: any = {
        formId: formData.formId,
        formName: formData.formName,
        formCode: formData.formCode,
        documentsUpload: this.selectedFileName,
        status: formData.status,
        createdBy: 'superuser',
      };
      this.formservice
        .addform(finaldata)
        .pipe(
          filter((response) => !!response),
          takeUntil(this.destroyed$)
        )
        .subscribe((response) => {
          this.openDialog(
            response.statusCode,
            response.message,
            response.errors,
            () => {
              if (response.statusCode === 200) {
                this.resetAndReloadGrid();
              }
            }
          );
        });
    }
  }

  openDialog(
    statusCode: number,
    message: string,
    errors: string[],
    onSuccess: () => void = () => {}
  ) {
    let dialogMessage = '';

    if (statusCode === 200) {
      dialogMessage = message;
      this.dialog
        .open(SuccessPopupComponent, {
          data: { message: dialogMessage, width: '400px', height: '200px' },
        })
        .afterClosed()
        .subscribe(() => {
          onSuccess(); // Call the callback function after dialog is closed
        });
    } else {
      dialogMessage = message + '\n' + errors.join('\n');
      this.dialog.open(ErrorPopupComponent, {
        data: { message: dialogMessage, width: '400px', height: '200px' },
      });
      // No callback here as we do not want to reset or reload on error
    }
  }

  private resetAndReloadGrid() {
    this.forms.reset({ status: 'Active' });
    this.getFormList();
    this.isEditForm = false;
    this.isNewForm = false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
