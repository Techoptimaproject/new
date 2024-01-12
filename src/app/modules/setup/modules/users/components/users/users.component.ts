
import { Subject, filter, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from 'src/app/shared/components/success-popup/success-popup.component';
import { ErrorPopupComponent } from 'src/app/shared/components/error-popup/error-popup.component';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/users.model';




@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {


  selectedOptions: any[] = [];
  userForm: FormGroup;
  customer: any = [];
  userListMain: User[] = [];
  originalList: any = [];
  searchText: string = '';
  custNamedropdownItems: any;
  userRoleMultiDropdown: any;
  errorMessage: string = '';
  destroyed$ = new Subject();
  isNewUser = false;
  isEditUser = false;
  namePattern = /^[a-zA-Z]/;
  destory$ = new Subject();
  selectedFileName: string = '';
  submitted = false;




  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    // private userService: ProjectsService
    private userService: UsersService
  ) {
    this.userForm = this.fb.group({
      index: [],
      userId: [],
      projId: [[], [Validators.required] ],
      userName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      userCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      roleIds: [[], [Validators.required]],
      userRole: [''],
      emailId: ['', [Validators.required]],
      status: ['', Validators.required],
    });
    this.setUpFormValidation();
  }

  ngOnInit(): void {
    this.userService.getMultiSelectedValues().subscribe((res) => this.userRoleMultiDropdown = res);
    this.userService.userDropdown().subscribe((res) => { this.custNamedropdownItems = res });
    this.getUserList()
  }

  filterGrid(): void {
    const searchTextLower = this.searchText.toLowerCase();

    if (!this.searchText) {
      this.userListMain = [...this.originalList];
    } else {
      console.log(searchTextLower);
      this.userListMain = this.originalList.filter(
        (f: any) =>
          f.userName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.userCode.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.emailId.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.projectName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.status.toString().toLowerCase() === searchTextLower
      );
    }
  }


  setUpFormValidation() {
    const emailIdControl = this.userForm.get('emailId');
  }


  private getUserList(): void {
    this.userService
      .userList()
      .pipe(takeUntil(this.destory$))
      .subscribe((item) => {
        this.originalList = item.data;
        this.userListMain = item.data;
        console.log(this.userListMain)
      });
  }

  onSubmit() {
    console.log(this.userForm.value)
    this.submitted = true;
    Object.keys(this.userForm.controls).forEach((field) => {
      const control = this.userForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
    const userData = this.userForm.value;

    if (this.userForm.invalid) {
      this.errorMessage = 'Form is invalid. Please fill above required fields.';
      return;
    } else {
      console.log('Form is valid and submitted.');
      this.errorMessage = '';
    }

    if (this.isEditUser) {
      let finaldata: any = {
        index: userData.index,
        userId: userData.userId,
        userName: userData.userName,
        userCode: userData.userCode,
        projId: userData.projId,
        roleIds: userData.roleIds,
        emailId: userData.emailId,
        createdBy: "superUser",
        status: userData.status,
        isDeleted: false
      };

      this.userService.updateUser(finaldata).pipe(
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
      const finaldata: any = {
        userId: 0,
        userName: userData.userName,
        userCode: userData.userCode,
        projId: userData.projId,
        roleIds: userData.roleIds,
        emailId: userData.emailId,
        createdBy: "superUser",
        status: userData.status,

      };

      this.userService.addUser(finaldata).pipe(
        filter((response) => !!response),
        takeUntil(this.destroyed$)
      ).subscribe((response) => {
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
    onSuccess: () => void = () => { }
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
          onSuccess();
        });
    } else {
      dialogMessage = message + '\n' + errors.join('\n');
      this.dialog.open(ErrorPopupComponent, {
        data: { message: dialogMessage, width: '400px', height: '200px' },
      });
    }
  }

  private resetAndReloadGrid() {
    this.userForm.reset({ status: 'Active' });
    this.getUserList();
    this.isEditUser = false;
    this.isNewUser = false;
  }

  onSaveClicked() {
    this.userForm.controls['save'].setValue(' ');
    this.onSubmit();
  }

  addUser(): void {
    this.userForm.reset({ status: 'Active' });
    this.isNewUser = true;
    this.isEditUser = false;
  }

  editUser(user: any): void {

    console.log(user);
    this.isEditUser = true;
    this.isNewUser = false;
    if (user.option === 'edit') {
      this.userForm.patchValue({
        index: user.index,
        userId: user.userId,
        userName: user.userName,
        userCode: user.userCode,
        projId: user.projectId,
        emailId: user.emailId,
        roleIds: user.roleId[0],
        status: user.status,
      });

    }
    if (user.option === 'delete') {
      this.isEditUser = false;
      this.isNewUser = false;

      const finaldata: any = {
        userId: user.userId,
        userName: user.userName,
        userCode: user.userCode,
        projId: user.projectId,
        createdBy: "superUser",
        emailId: user.emailId,
        roleIds: user.roleId[0],
        status: user.status,
        isDeleted: true
      };

      this.userService
        .updateUser(finaldata)
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
    this.isEditUser = false;
    this.isNewUser = false;
  }
  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}