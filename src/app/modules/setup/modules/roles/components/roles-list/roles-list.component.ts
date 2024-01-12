import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Role } from '../../models/roles.model';
import { RolesService } from '../../services/roles.service';
import { Subject, takeUntil } from 'rxjs';

import { PrimengTable } from 'src/app/shared/models/primeng-table.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
})
export class RolesListComponent {
  @Output('triggerEditRow') triggerEditRow = new EventEmitter<Role>();
  @Input() rolesList: Role[] = [];

  roleForm: FormGroup;
  customer: Role[] = [];
  roleList: Role[] = [];
  originalList: Role[] = [];
  searchText: string = '';
  custNamedropdownItems: any;
  formNameMultiDropdown: any;
  errorMessage: string = '';

  sortOrder: number = 1; // 1 for ascending, -1 for descending
  sortField: string = '';

  cols: PrimengTable[] = [
    {
      field: 'roleId',
      header: 'S.No',
    },
    {
      field: 'roleName',
      header: 'Role Name',
    },

    {
      field: 'roleCode',
      header: 'Role Code',
    },
    {
      field: 'roleType',
      header: 'Role Type',
    },
    {
      field: 'permission',
      header: 'Permission',
    },

    {
      field: 'status',
      header: 'Status',
    },
    {
      field: '',
      header: 'Action',
    },
  ];

  destroyed$ = new Subject();

  isNewRole = false;
  isEditRole = false;

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) {
    this.roleForm = this.fb.group({
      roleId: [''],
      roleName: [''],
      roleType: [''],
      roleCode: [''],
      permId: [''],
      Status: [''],
    });
  }

  ngOnInit(): void {
    this.getRolestlist();
    console.log('I am exectuing');
    this.rolesService
      .getRole()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.rolesList = response.data;
        console.log('role Data:', response.data);
      });
  }

  getRolestlist() {
    console.log('executed from getRoleList');
    return this.rolesService
      .getRole()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        // console.log(res);
        this.roleList = res.data;
        console.log('getRoleList Data:', res.data);
      });
  }

  sortData<T>(field: keyof Role) {
    if (field === this.sortField) {
      this.sortOrder = -this.sortOrder;
    } else {
      this.sortOrder = 1;
      this.sortField = field;
    }

    this.rolesList.sort((a, b) => {
      const valueA = a[field] as unknown as T;
      const valueB = b[field] as unknown as T;

      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        // For boolean values, sort `true` before `false`
        return (valueA === valueB ? 0 : valueA ? -1 : 1) * this.sortOrder;
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * this.sortOrder;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * this.sortOrder;
      } else {
        // Add additional cases for other data types if necessary
        return 0;
      }
    });
  }

  editRow(role: Role, option: any): void {
    console.log('role', role);

    const dataedit = Object.assign(role, { option: option });
    this.triggerEditRow.emit(role);
  }

  deleteRow(role: any): void {
    this.rolesService.updateRole(role.roleId).subscribe(
      () => {
        this.getRolestlist();
      },
      (error) => {
        console.error('DeleteError', error);
      }
    );
  }

  addRole(): void {
    this.isNewRole = true;
  }

  editRole(role: Role): void {
    this.isEditRole = true;
    this.roleForm.patchValue(role);
    this.triggerEditRow.emit(role);
  }

  onCancel(): void {
    this.roleForm.markAsPristine();
    this.isEditRole = false;
    this.isNewRole = false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
