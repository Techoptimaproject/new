import { Injectable } from '@angular/core';
import { API_BASE_URL_form } from 'src/app/core/models/api-url-config';
import { HttpWrapperService } from 'src/app/shared/services/http-wrapper.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StandardResponse } from 'src/app/shared/models/standard-response.model';
import { Forms } from '../models/forms.model';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  private apiUrl = `${API_BASE_URL_form}form`;
  constructor(
    private httpWrapperService: HttpWrapperService,
    private http: HttpClient
  ) {}

  getform(): Observable<StandardResponse<Forms[]>> {
    return this.httpWrapperService.get<Forms[]>(this.apiUrl);
  }

  getgetformById(formId: number): Observable<StandardResponse<Forms>> {
    const url = `${this.apiUrl}/${formId}`;
    return this.httpWrapperService.get<Forms>(url);
  }
  addform(form: any): Observable<StandardResponse<Forms>> {
    return this.httpWrapperService.post<Forms>(this.apiUrl, form);
  }

  updateform(form: any): Observable<StandardResponse<Forms>> {
    const url = `${this.apiUrl}/${form.formId}`;
    return this.httpWrapperService.put<Forms>(url, form);

  }
  deleteform(formId: number): Observable<StandardResponse<void>> {
    const url = `${this.apiUrl}/${formId}`;
    return this.httpWrapperService.delete<void>(url);
  }
}
