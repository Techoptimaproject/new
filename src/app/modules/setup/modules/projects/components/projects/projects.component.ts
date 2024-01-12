import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/projects.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  @ViewChild('dropdownMenu', { static: false }) dropdownMenu!: ElementRef;

  selectedOptions: any[] = [];
  projectForm: FormGroup;
  customer: Project[] = [];
  projectList: Project[] = [];
  originalList: Project[] = [];
  searchText: string = '';
  custNamedropdownItems: any;
  formNameMultiDropdown: any;
  errorMessage: string = '';

  destroyed$ = new Subject();
  isNewProject = false;
  isEditProject = false;
  namePattern = /^[a-zA-Z]/;

  destory$ = new Subject();

  selectedFileName: string = '';

  // @Output('triggerEditRow') triggerEditRow = new EventEmitter<Customer>();
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private projectService: ProjectsService
  ) {
    this.projectForm = this.fb.group({
      projId: [''],
      projectName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      projectCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      custId: [
        Number,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/),
        ],
      ],
      formId: [[]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      status: ['', Validators.required],
    });
    this.setUpFormValidation();
  }

  ngOnInit(): void {
    this.getProjectList();
    this.projectService
      .getMultiSelectedValues()
      .subscribe((res) => (this.formNameMultiDropdown = res));
    this.projectService.customerdropdown().subscribe((res) => {
      this.custNamedropdownItems = res;
    });
  }

  filterGrid(): void {
    const searchTextLower = this.searchText.toLowerCase();

    if (!this.searchText) {
      this.projectList = [...this.originalList];
    } else {
      console.log(searchTextLower);
      this.projectList = this.originalList.filter(
        (f) =>
          f.projectName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.projectCode.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.startDate.toLowerCase().includes(this.searchText.toLowerCase()) ||
          // f.endDate.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.custName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          f.status.toString().toLowerCase() === searchTextLower
      );
    }
  }

  setUpFormValidation() {
    const startDateControl = this.projectForm.get('startDate');
    const endDateControl = this.projectForm.get('endDate');

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

  private getProjectList(): void {
    this.projectService
      .getProjectList()
      .pipe(takeUntil(this.destory$))
      .subscribe((item) => {
        this.originalList = item.data;
        this.projectList = item.data;
      });
  }

  onSubmit() {
    this.submitted = true;
    Object.keys(this.projectForm.controls).forEach((field) => {
      const control = this.projectForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
    const ProjectData = this.projectForm.value;

    if (this.projectForm.invalid) {
      this.errorMessage = 'Form is invalid. Please fill above required fields.';
      return;
    } else {
      console.log('Form is valid and submitted.');
      this.errorMessage = '';
    }

    const selectedFormIds = this.projectForm.get('formIds')?.value ?? [];

    if (this.isEditProject) {
      const finaldata: any = {
        projId: ProjectData.projId,
        projectName: ProjectData.projectName,
        projectCode: ProjectData.projectCode,
        custId: ProjectData.custId,
        formIds: ProjectData.formId,
        startDate: ProjectData.startDate,
        endDate: ProjectData.endDate,
        status: ProjectData.status,
        isDeleted: false,
      };

      this.projectService
        .updateProject(finaldata)
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
      const finaldata: any = {
        projectName: ProjectData.projectName,
        projectCode: ProjectData.projectCode,
        custId: ProjectData.custId,
        formIds: ProjectData.formId,
        startDate: ProjectData.startDate,
        endDate: ProjectData.endDate,
        status: ProjectData.status,
        isDeleted: false,
      };
      this.projectService
        .addProject(finaldata)
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
    this.projectForm.reset({ status: 'Active' });
    this.getProjectList();
    this.isEditProject = false;
    this.isNewProject = false;
  }

  onSaveClicked() {
    this.projectForm.controls['save'].setValue(' '); // Set a space to trigger validation
    this.onSubmit();
  }

  addProject(): void {
    this.projectForm.reset({ status: 'Active' });
    this.isNewProject = true;
    this.isEditProject = false;
  }

  editProject(project: any): void {
    if (project.option === 'edit') {
      this.isEditProject = true;
      this.isNewProject = false;
      // console.log('In edit', project);

      this.projectForm.setValue({
        projId: project.projId,
        projectName: project.projectName,
        projectCode: project.projectCode,
        custId: project.custId,
        formId: project.formId[0],
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
      });
    }

    if (project.option === 'delete') {
      const finaldata: any = {
        projId: project.projId,
        projectName: project.projectName,
        projectCode: project.projectCode,
        custId: project.custId,
        formIds: project.formId[0],
        startDate: project.startDate,

        endDate: project.endDate,
        status: project.status,
        isDeleted: true,
      };

      this.projectService
        .updateProject(finaldata)
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
    // console.log(project);
  }

  onCancel(): void {
    this.isEditProject = false;
    this.isNewProject = false;
  }

  ngOnChanges() {
    this.getProjectList();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
