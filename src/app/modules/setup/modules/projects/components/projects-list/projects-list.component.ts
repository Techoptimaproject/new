import {
  Component,
  OnInit,
  Output,
  OnDestroy,
  EventEmitter,
  Input,
} from '@angular/core';
import { PrimengTable } from 'src/app/shared/models/primeng-table.model';

import { Subject, last, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/projects.model';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit {
  destroyed$ = new Subject();
  @Input() projectList: Project[] = [];
  sortOrder: number = 1; // 1 for ascending, -1 for descending
  sortField: string = '';
  filterDataDelete: any;
  obj: any;
  finalobj: any;
  formsobj: any;
  finalbojforms: any;
  cols: PrimengTable[] = [
    {
      field: 'projId',
      header: 'S.No',
    },
    {
      field: 'projectName',
      header: 'Project Name',
    },
    {
      field: 'projectCode',
      header: 'Project Code',
    },
    {
      field: 'custName',
      header: 'Customer Name',
    },
    {
      field: 'formName',
      header: 'Forms',
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
  @Output('triggerEditRow') triggerEditRow = new EventEmitter<Project>();

  constructor(
    private http: HttpClient,
    private projectService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.getProjectlist();
  }

  sortData<T>(field: keyof Project) {
    if (field === this.sortField) {
      this.sortOrder = -this.sortOrder;
    } else {
      this.sortOrder = 1; // Default to ascending for a new column
      this.sortField = field;
    }

    // Implement your custom sorting logic here based on the field and order
    this.projectList.sort((a, b) => {
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
  private getProjectlist(): void {
    this.projectService
      .getProjectList()
      .pipe(takeUntil(this.destory$))
      .subscribe((res) => {
        // console.log(res);
        this.projectList = res.data;
        // console.log(this.projectList)
      });
  }

  editRow(project: any, option: any) {
    // logic for customer
    this.projectService.customerdropdown().subscribe((res) => {
      res;
      sessionStorage.setItem('user', JSON.stringify(res));
    });

    this.obj = sessionStorage.getItem('user');
    this.finalobj = JSON.parse(this.obj);
    const finalfilterCustomer = this.finalobj.filter(
      (ele: any) => ele.custName === project.custName
    );
    const lastProject = Object.assign(project, finalfilterCustomer[0]);
    //logic ends here for customer

    //logic for forms

    // console.log(project)
    this.projectService.getMultiSelectedValues().subscribe((res) => {
      res;

      sessionStorage.setItem('forms', JSON.stringify(res));
    });
    this.formsobj = sessionStorage.getItem('forms');
    this.finalbojforms = JSON.parse(this.formsobj);
    // const finalfilterforms= this.finalbojforms.filter((ele:any)=>ele.formName===project.formName);
    const finalfilterforms = this.finalbojforms.filter((item: any) =>
      project.formName.includes(item.formName)
    );

    // console.log(finalfilterforms)
    const snoArray = finalfilterforms.map((item: any) => item.formId);
    const result = { formId: [snoArray] };

    //logic for forms ends here
    const overallfinal = Object.assign(lastProject, result);
     const userDataEditanddelete =Object.assign(overallfinal,{option:option})

    console.log(userDataEditanddelete)
    this.triggerEditRow.emit(userDataEditanddelete);
  }

  deleteRow(project: any, index: number): void {
    this.projectService.deleteProject(project.projId).subscribe(
      (res) => {
        res;
        console.log('Delete Successful');
        this.getProjectlist();
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
