
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StandardResponse } from 'src/app/shared/models/standard-response.model';

import { HttpWrapperService } from 'src/app/shared/services/http-wrapper.service';
import { API_BASE_URL_USERS, API_BASE_URL_lookup } from 'src/app/core/models/api-url-config';
import { User } from '../models/users.model';



@Injectable()
export class UsersService {
  private api_user_url = `${API_BASE_URL_USERS}User`
  private api_userLookup_url = `http://20.165.48.238:98/api/Lookup/projects`;
  private api_getmultilookup_url = `http://20.165.48.238:98/api/Lookup/roles`;


  constructor(private httpWrapperService: HttpWrapperService) { }

  userDropdown(): Observable<StandardResponse<any>> {
    return this.httpWrapperService.get(this.api_userLookup_url);
  }

  getMultiSelectedValues(): Observable<StandardResponse<any>> {
    return this.httpWrapperService.get(this.api_getmultilookup_url);
  }

  addUser(data: any): Observable<StandardResponse<any>> {
    const url = `${this.api_user_url}`;
    console.log(data);
    return this.httpWrapperService.post<any>(url, data);
  }

  userList(): Observable<StandardResponse<User[]>> {
    const url = `${this.api_user_url}`;
    return this.httpWrapperService.get<User[]>(url);
  }

  updateUser(data: any): Observable<StandardResponse<any>> {
    const url = `${this.api_user_url}/${data.userId}`;
    console.log(data);
    return this.httpWrapperService.put<any>(url, data);
  }






}