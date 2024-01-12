import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StandardResponse } from 'src/app/shared/models/standard-response.model';
import { Project } from '../models/projects.model';
import { HttpWrapperService } from 'src/app/shared/services/http-wrapper.service';
import {  API_BASE_URL_project, API_BASE_URL_lookup } from 'src/app/core/models/api-url-config';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private api_project_url=`${API_BASE_URL_project}project`
  private api_customerslookup_url= `${API_BASE_URL_lookup}Lookup/customers`
  private api_formslookup_url=`${API_BASE_URL_lookup}Lookup/forms`

  constructor(private httpWrapperService: HttpWrapperService) { }

  customerdropdown(): Observable<StandardResponse<Project[]>> {
    return this.httpWrapperService.get(this.api_customerslookup_url);
  }

  getMultiSelectedValues(): Observable<StandardResponse<Project[]>> {
    return this.httpWrapperService.get(this.api_formslookup_url);
  }

  addProject(data: any): Observable<StandardResponse<any>> {  
    const url = `${this.api_project_url}`;
    return this.httpWrapperService.post<any>(url, data);
  }

  getProjectList(): Observable<StandardResponse<Project[]>> {
    const url = `${this.api_project_url}`;
    return this.httpWrapperService.get<Project[]>(url);
  }

  updateProject(data: any): Observable<StandardResponse<any[]>> {
    const url = `${this.api_project_url}/${data.projId}`;
    console.log(data);
    return this.httpWrapperService.put<any[]>(url, data);
  }

  deleteProject(projectid: number): Observable<StandardResponse<void>> {
    console.log(projectid);
    const url = `${this.api_project_url}/${projectid}`;
    return this.httpWrapperService.delete<void>(url);
  }




}
