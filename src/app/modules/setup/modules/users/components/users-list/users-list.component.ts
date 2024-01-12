import {
  Component,
  OnInit,
  Output,
  OnDestroy,
  EventEmitter,
  Input,
} from '@angular/core';
import { PrimengTable } from 'src/app/shared/models/primeng-table.model';

import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { UsersService } from '../../services/users.service';
import { User } from '../../models/users.model';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})


export class UsersListComponent implements OnInit, OnDestroy {


  destroyed$ = new Subject();
  sortOrder: number = 1;
  sortField: string = '';
  filterDataDelete: any;
  obj: any;
  finalobj: any;
  formsobj: any;
  finalbojforms: any;
  cols: PrimengTable[] = [

    {
      field: 'userId',
      header: 'S.No',
    },
    {
      field: 'userName',
      header: 'Name',
    },
    {
      field: 'userCode',
      header: 'User Code',
    },
    {
      field: 'projectName',
      header: 'Project',
    },
    {
      field: 'emailId',
      header: 'Email ID',
    },
    {
      field: 'roles',
      header: 'Role',
    },
    {
      field: 'status',
      header: 'Status',
    },
    {
      field: '',
      header: 'Action',
    }
  ];
  destory$ = new Subject();
  @Output('triggerEditRow') triggerEditRow = new EventEmitter<User[]>();
  @Input() userList: User[] = []

  constructor(
    private http: HttpClient,
    private userService: UsersService
  ) { }

  ngOnInit(): void {

  }

  sortData<T>(field: keyof User) {
    if (field === this.sortField) {
      this.sortOrder = -this.sortOrder;
    } else {
      this.sortOrder = 1;
      this.sortField = field;
    }
    this.userList.sort((a: any, b: any) => {
      const valueA = a[field] as unknown as T;
      const valueB = b[field] as unknown as T;

      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {

        return (valueA === valueB ? 0 : valueA ? -1 : 1) * this.sortOrder;
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * this.sortOrder;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * this.sortOrder;
      } else {

        return 0;
      }
    });
  }

  getUserList(): void {
    this.userService
      .userList()
      .pipe(takeUntil(this.destory$))
      .subscribe((res) => {
        console.log(res);
        this.userList = res.data;

      });
  }

  editRow(user: any, option: any) {
    this.userService.userDropdown().subscribe((res) => {
      res;
      sessionStorage.setItem('userdata', JSON.stringify(res));
    });

    this.obj = sessionStorage.getItem('userdata');
    this.finalobj = JSON.parse(this.obj);
    const finalfilterCustomer = this.finalobj.filter(
      (ele: any) => ele.projectName === user.projectName
    );
    const lastProject = Object.assign(user, finalfilterCustomer[0]);



    this.userService.getMultiSelectedValues().subscribe((res) => {
      res;

      sessionStorage.setItem('formsdata', JSON.stringify(res));
    });
    this.formsobj = sessionStorage.getItem('formsdata');
    this.finalbojforms = JSON.parse(this.formsobj);
    const finalfilterforms = this.finalbojforms.filter((item: any) =>
      user.roles.includes(item.roleName)
    );
    console.log(finalfilterforms)
    const snoArray = finalfilterforms.map((item: any) => item.roleId);
    const result = { roleId: [snoArray] };
    Object.assign(lastProject, { option: option })
    const overallfinal = Object.assign(lastProject, result);
    this.triggerEditRow.emit(overallfinal);
  }
  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}

