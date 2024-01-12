import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';



@NgModule({
  declarations: [ProjectsComponent, ProjectsListComponent],
  imports: [CommonModule, ProjectsRoutingModule, SharedModule,MaterialModule],
})
export class ProjectsModule {}
