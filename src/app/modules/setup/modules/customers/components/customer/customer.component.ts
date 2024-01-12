import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { Subject, filter, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from 'src/app/shared/components/success-popup/success-popup.component';
import { ErrorPopupComponent } from 'src/app/shared/components/error-popup/error-popup.component';
import { CustomersService } from '../../services/customers.service';
import { Customer } from '../../models/customer.model';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

// import { CustomersService } from 'src/app/customers.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent {
  customerForm: FormGroup;
  customer: Customer[] = [];
  customerList: Customer[] = [];
  originalList: Customer[] = [];
  searchText: string = '';

  errorMessage: string = '';

  destroyed$ = new Subject();
  isNewCustomer = false;
  isEditCustomer = false;
  namePattern = /^[a-zA-Z]/;

  destory$ = new Subject();

  selectedFileName: string = '';

  // @Output('triggerEditRow') triggerEditRow = new EventEmitter<Customer>();
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private customerService: CustomersService
  ) {
    this.customerForm = this.fb.group({
      custName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      custCode: ['', [Validators.required]],
      custId: [''],
      emailId: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],

      taxId: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{7}$/)]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      status: ['', Validators.required],
      logoUrlPath: [''],

      fontColor: ['', [Validators.required]],
      primaryColor: ['', [Validators.required]],
      secondaryColor: ['', [Validators.required]],

      address: ['', [Validators.required]],
      state: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],
      city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    });
    this.setUpFormValidation();
  }

  ngOnInit(): void {
    this.getCustomerList();
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedFileName = file ? file.name : '';
    }
  }

  filterGrid(): void {
    const searchTextLower = this.searchText.toLowerCase();
    console.log('Search calling:');
    if (!this.searchText) {
      this.customerList = [...this.originalList];
    } else {
      this.customerList = this.originalList.filter(
        (f) =>
          f.custName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.custCode.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.taxId.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.startDate.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.endDate.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.status.toString().toLowerCase() === searchTextLower
      );
    }
  }

  setUpFormValidation() {
    const startDateControl = this.customerForm.get('startDate');
    const endDateControl = this.customerForm.get('endDate');

    if (startDateControl && endDateControl) {
      startDateControl.valueChanges.subscribe(() => {
        endDateControl.setValidators([
          this.dateGreaterThanOrEqualTo(startDateControl.value),
        ]);
        endDateControl.updateValueAndValidity();
      });
    }
  }

  dateGreaterThanOrEqualTo(startDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // If endDate is not set, consider it valid
      }
      if (!startDate) {
        return null; // If startDate is not set, consider endDate valid
      }

      const endDate = new Date(control.value);
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1);

      return endDate >= start ? null : { dateInvalid: true };
    };
  }

  private getCustomerList(): void {
    this.customerService
      .getCustomers()
      .pipe(takeUntil(this.destory$))
      .subscribe((item) => {
        this.originalList = item.data;
        console.log(item);
        this.customerList = item.data;
      });
  }

  onColorChange(event: any) {
    const hexColor = event.target.value;
    this.customerForm.get('selectedColor')?.setValue(hexColor);
  }

  onSubmit() {
    // debugger;
    this.submitted = true;
    Object.keys(this.customerForm.controls).forEach((field) => {
      const control = this.customerForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
    const customerData = this.customerForm.value;

    if (this.customerForm.invalid) {
      this.errorMessage = 'Form is invalid. Please fill above required fields.';
      return;
    } else {
      console.log('Form is valid and submitted.');
      this.errorMessage = '';
    }

    var finaldata: any = {
      custId: customerData.custId,
      custName: customerData.custName,
      custCode: customerData.custCode,
      emailId: customerData.emailId,
      phoneNumber: customerData.phoneNumber,
      taxId: customerData.taxId,
      startDate: customerData.startDate,
      endDate: customerData.endDate,
      status: customerData.status,
      fontColor: customerData.fontColor,
      primaryColor: customerData.primaryColor,
      secondaryColor: customerData.secondaryColor,
      logoUrlPath: this.selectedFileName,
      address: customerData.address,
      state: customerData.state,
      city: customerData.city,
      zipCode: customerData.zipCode,
      createdBy: 'superuser',
    };

    console.log(customerData);

    if (this.isEditCustomer) {
      this.customerService
        .updateCustomer(finaldata)
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
      this.customerService
        .addCustomer(finaldata)
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
    }
  }

  private resetAndReloadGrid() {
    this.customerForm.reset({ status: 'Active' });
    this.getCustomerList();
    this.isEditCustomer = false;
    this.isNewCustomer = false;
  }

  onSaveClicked() {
    this.customerForm.controls['save'].setValue(' '); // Set a space to trigger validation
    this.onSubmit();
  }

  addCustomer(): void {
    this.customerForm.reset({ status: 'Active' });
    this.isNewCustomer = true;
    this.isEditCustomer = false;
  }

  editCustomer(customerForm: Customer): void {
    if (customerForm.option === 'edit') {
      this.isEditCustomer = true;
      this.isNewCustomer = false;
      console.log('In edit', customerForm);
      this.customerForm.setValue({
        custId: customerForm.custId,
        status: customerForm.status,
        custName: customerForm.custName,
        custCode: customerForm.custCode,
        emailId: customerForm.emailId,
        phoneNumber: customerForm.phoneNumber,
        taxId: customerForm.taxId,
        startDate: customerForm.startDate,
        endDate: customerForm.endDate,
        address: customerForm.address,
        state: customerForm.state,
        city: customerForm.city,
        zipCode: customerForm.zipCode,
        fontColor: customerForm.fontColor,
        primaryColor: customerForm.primaryColor,
        secondaryColor: customerForm.secondaryColor,
        logoUrlPath: customerForm.logoUrlPath,
        //   createdBy: 'superuser',
      });
      console.log(customerForm);
    }

    if (customerForm.option === 'delete') {
      this.isEditCustomer = false;
      this.isNewCustomer = false;

      const finaldata: any = {
        custId: customerForm.custId,
        status: customerForm.status,
        custName: customerForm.custName,
        custCode: customerForm.custCode,
        emailId: customerForm.emailId,
        phoneNumber: customerForm.phoneNumber,
        taxId: customerForm.taxId,
        startDate: customerForm.startDate,
        endDate: customerForm.endDate,
        address: customerForm.address,
        state: customerForm.state,
        city: customerForm.city,
        zipCode: customerForm.zipCode,
        fontColor: customerForm.fontColor,
        primaryColor: customerForm.primaryColor,
        secondaryColor: customerForm.secondaryColor,
        logoUrlPath: customerForm.logoUrlPath,
        isDeleted: true,
      };
      this.customerService
        .updateCustomer(finaldata)
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
    this.isEditCustomer = false;
    this.isNewCustomer = false;
  }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.uploadFile(file);
  //   }
  // }

  // uploadFile(file: File) {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file, file.name);

  // const url = 'YOUR_SERVER_ENDPOINT_TO_UPLOAD_FILE';

  // this.http.post(url, formData).subscribe(
  //   (response: any) => {
  //     console.log('Upload successful', response);
  //     // If your server responds with the URL of the uploaded file
  //     // this.customerForm.get('logoUrlPath').setValue(response.fileUrl);
  //   },
  //   (error) => console.error('Upload failed', error)
  // );
  // }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
