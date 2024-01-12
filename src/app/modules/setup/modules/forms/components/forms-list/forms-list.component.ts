import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Forms } from '../../models/forms.model';
import { PrimengTable } from 'src/app/shared/models/primeng-table.model';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss'],
})
export class FormsListComponent implements OnInit {
  destory$ = new Subject();
  @Input() formList: Forms[] = [];

  sortOrder: number = 1; // 1 for ascending, -1 for descending
  sortField: string = '';
  cols: PrimengTable[] = [
    {
      field: 'formId',
      header: 'S.No ',
    },
    {
      field: 'formName',
      header: 'Form Name',
    },
    {
      field: 'formCode',
      header: 'Form Code',
    },
    {
      field: 'documentsUpload',
      header: 'Documents Uploaded',
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
  @Output('triggerEditRow') triggerEditRow = new EventEmitter<Forms>();
  constructor(private http: HttpClient, private formService: FormsService) {}

  ngOnInit(): void {
    this.getFormList();
  }

  sortData<T>(field: keyof Forms) {
    if (field === this.sortField) {
      this.sortOrder = -this.sortOrder;
    } else {
      this.sortOrder = 1;
      this.sortField = field;
    }

    this.formList.sort((a, b) => {
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

  private getFormList(): void {
    this.formService
      .getform()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((items) => {
        console.log(items);
        this.formList = items.data;
      });
  }

  editRow(rowData: Forms, option: any): void {
    console.log('Editing row:', rowData);
    const dataedit = Object.assign(rowData, { option: option });
    this.triggerEditRow.emit(rowData);
  }

  deleteRow(rowData: Forms, index: number): void {
    this.formList.splice(index, 1);
    this.formService.deleteform(rowData.formId).subscribe(
      () => {
        this.getFormList();
      },
      (error) => {
        console.log('Deleting row:', error);
      }
    );
  }

  // toggleContent(): void {
  //   const formContent = document.getElementById('formContent');
  //   if (formContent) {
  //     const isCollapsed = formContent.classList.contains('show');
  //     if (isCollapsed) {
  //       formContent.classList.remove('show');
  //     } else {
  //       formContent.classList.add('show');
  //     }
  //   }
  // }
  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
