import { Component } from '@angular/core';
import { Subject, filter, finalize, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PrimengTable } from 'src/app/shared/models/primeng-table.model';
import { Role } from '../../models/roles.model';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from 'src/app/shared/components/success-popup/success-popup.component';
import { StandardResponse } from 'src/app/shared/models/standard-response.model';
import { ErrorPopupComponent } from 'src/app/shared/components/error-popup/error-popup.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent {
  roleForm: FormGroup;
  roles: Role[] = [];
  roleList: Role[] = [];
  originalFormList: Role[] = [];
  destroyed$ = new Subject();
  searchText: string = '';
  selectedFileName: string = '';
  isEditRole = false;
  isNewRole = false;
  errorMessage: string = '';
  permLokup: any;
  RoleLokup: any;

  submitted = false;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private roleservice: RolesService // private snackBar: MatSnackBar
  ) {
    this.roleForm = this.fb.group({
      roleId: [''],
      roleCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      roleName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      roleType: ['', Validators.required],
      permId: [Number],
      status: [''],
    });
  }
  addRole(): void {
    this.roleForm.reset({ status: 'Active' });
    this.isNewRole = true;
    this.isEditRole = false;
  }
  ngOnInit(): void {
    this.getRoleList();

    this.roleservice.permissionLookup().subscribe((res) => {
      console.log('res', res);
      this.permLokup = res;
      console.log('RoleNames', this.permLokup);
    });

    this.roleservice.RoleLookup().subscribe((res) => {
      this.RoleLokup = res;
      console.log('RoleLookUp', this.RoleLokup);
    });
  }

  filterGrid(): void {
    const searchTextLower = this.searchText.toLowerCase();
    console.log('role search calling', this.roleList);
    if (!this.searchText) {
      this.roleList = [...this.originalFormList];
    } else {
      this.roleList = this.originalFormList.filter(
        (f) =>
          f.roleName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.roleCode.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.status.toString().toLowerCase() === searchTextLower ||
          f.permission.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
  getRoleList(): void {
    this.roleservice
      .getRole()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((item) => {
        this.originalFormList = item.data;
        this.roleList = item.data;
      });
  }

  editRole(selectedRole: Role): void {
    if (selectedRole.option === 'edit') {
      this.isEditRole = true;
      this.isNewRole = false;
      console.log('selectedRole', selectedRole);
      // Set the form values
      this.roleForm.setValue({
        roleId: selectedRole.roleId,
        roleName: selectedRole.roleName,
        roleCode: selectedRole.roleCode,
        roleType: selectedRole.roleType,
        permId: selectedRole.permId,
        status: selectedRole.status,
      });
    }

    if (selectedRole.option === 'delete') {
      this.isEditRole = false;
      this.isNewRole = false;

      const finaldata: any = {
        roleId: selectedRole.roleId,
        roleName: selectedRole.roleName,
        roleCode: selectedRole.roleCode,
        roleType: selectedRole.roleType,
        accessPrev: selectedRole.permId,
        status: selectedRole.status,
        isDeleted: true,
      };
      this.roleservice
        .updateRole(finaldata)
        .pipe(
          filter((response) => !!response),
          takeUntil(this.destroyed$)
        )

        .subscribe((response) => {
          console.log(response);
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
    this.roleForm.reset();
    this.isEditRole = false;
    this.isNewRole = false;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedFileName = file ? file.name : '';
    }
  }

  onSubmit() {
    this.submitted = true;
    Object.keys(this.roleForm.controls).forEach((field) => {
      const control = this.roleForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
    const roleData = this.roleForm.value;

    console.log('roleDAta', roleData);

    if (this.roleForm.invalid) {
      this.errorMessage = 'Form is invalid. Please fill above required fields.';
      return;
    } else {
      console.log('Form is valid and submitted.');
      this.errorMessage = '';
    }

    if (this.isEditRole) {
      const finaldata: any = {
        roleId: roleData.roleId,
        roleName: roleData.roleName,
        roleType: roleData.roleType,
        roleCode: roleData.roleCode,
        accessPrev: roleData.permId,
        status: roleData.status,
        createdBy: 'superUser',
        isDeleted: false,
      };
      this.roleservice
        .updateRole(finaldata)
        .pipe(
          filter((response) => !!response),
          takeUntil(this.destroyed$)
        )

        .subscribe((response) => {
          console.log(response);
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
        roleName: roleData.roleName,
        roleCode: roleData.roleCode,
        roleType: roleData.roleType,
        accessPrev: roleData.permId,
        status: roleData.status,
        createdBy: 'superuser',
      };
      this.roleservice
        .addRole(finaldata)
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

  resetAndReloadGrid() {
    this.getRoleList();
    console.log('reload');
    this.roleForm.reset();
    this.isEditRole = false;
    this.isNewRole = false;
    // console.log('Reloaded Data', this.resetAndReloadGrid());
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

  ngOnchanges() {
    this.getRoleList();
  }
}
