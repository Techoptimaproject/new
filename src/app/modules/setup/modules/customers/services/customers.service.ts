import { Injectable } from '@angular/core';
import { API_BASE_URL_cust } from 'src/app/core/models/api-url-config';
import { HttpWrapperService } from 'src/app/shared/services/http-wrapper.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StandardResponse } from 'src/app/shared/models/standard-response.model';
import { Customer } from '../models/customer.model';

@Injectable()
export class CustomersService {
  private apiUrl = `${API_BASE_URL_cust}customer`;

  constructor(
    private httpWrapperService: HttpWrapperService,
    private http: HttpClient
  ) {}

  getCustomers(): Observable<StandardResponse<Customer[]>> {
    const url = `${this.apiUrl}`;
    return this.httpWrapperService.get<Customer[]>(url);
  }

  getCustomerById(custId: number): Observable<StandardResponse<Customer>> {
    const url = `${this.apiUrl}/${custId}`;
    return this.httpWrapperService.get<Customer>(url);
  }
  
  addCustomer(customer: any): Observable<StandardResponse<Customer>> {
  
    return this.httpWrapperService.post<Customer>(this.apiUrl, customer);
  }
  
  updateCustomer(customer: any): Observable<StandardResponse<Customer>> {
  
    const url = `${this.apiUrl}/${customer.custId}`;
    return this.httpWrapperService.put<Customer>(url, customer);
  }

  deleteCustomer(customerId: number): Observable<StandardResponse<void>> {
    const url = `${this.apiUrl}/${customerId}`;
    return this.httpWrapperService.delete<void>(url);
  }
}
