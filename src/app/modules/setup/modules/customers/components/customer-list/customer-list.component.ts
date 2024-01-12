import {
  Component,
  OnInit,
  Output,
  Input,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { PrimengTable } from 'src/app/shared/models/primeng-table.model';
import { Customer } from '../../models/customer.model';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  destroyed$ = new Subject();
  @Input() customerList: Customer[] = [];
  sortOrder: number = 1; // 1 for ascending, -1 for descending
  sortField: string = '';  
  cols: PrimengTable[] = [
    {
      field: 'custId',
      header: 'S.No',
    },
    {
      field: 'custName',
      header: 'Customer Name',
    },
    {
      field: 'custCode',
      header: 'Customer Code',
    },
    {
      field: 'taxId',
      header: 'Feed Tax ID #',
    },
    {
      field: 'startDate',
      header: 'Effective From',
    },
    {
      field: 'endDate',
      header: 'Effective Thru',
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
  destory$ = new Subject();
  @Output('triggerEditRow') triggerEditRow = new EventEmitter<Customer>();

  constructor(
    private http: HttpClient,
    private customerService: CustomersService
  ) {}

  ngOnInit(): void {
    this.getCustomerList();
  }

  sortData<T>(field: keyof Customer) {
    if (field === this.sortField) {
      this.sortOrder = -this.sortOrder;
    } else {
      this.sortOrder = 1; // Default to ascending for a new column
      this.sortField = field;
    }
 
    // Implement your custom sorting logic here based on the field and order
    this.customerList.sort((a, b) => {
      // Ensure that the properties exist on the Customer objects
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
  private getCustomerList(): void {
    this.customerService
      .getCustomers()
      .pipe(takeUntil(this.destory$))
      .subscribe((item) => {
        console.log(item);
        this.customerList = item.data;
      });
  }

  editRow(customer: Customer,option: any): void {
    const dataedit = Object.assign(customer, { option: option });
    console.log('edit');
    this.triggerEditRow.emit(customer);
  }

  deleteRow(customer: Customer, index: number): void {
    this.customerList.splice(index, 1);
    this.customerService.deleteCustomer(customer.custId).subscribe(
      () => {
        console.log('Delete Successful');
        this.getCustomerList();
      },
      (error) => {
        console.error('Delete Error:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
