import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_BASE_URL_role,
  API_BASE_URL_lookup,
  API_BASE_URL_Role_lookup,
} from 'src/app/core/models/api-url-config';
import { HttpWrapperService } from 'src/app/shared/services/http-wrapper.service';
import { Role } from '../models/roles.model';
import { StandardResponse } from 'src/app/shared/models/standard-response.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private apiUrl = `${API_BASE_URL_role}Role`;
  private api_permission_lookup_url = `${API_BASE_URL_lookup}LookUp/permissions`;
  private api_Role_lookup_url = `${API_BASE_URL_Role_lookup}Lookup/existedroles`;

  constructor(private httpWrapperService: HttpWrapperService) {}

  getRole(): Observable<StandardResponse<any>> {
    return this.httpWrapperService.get<any>(this.apiUrl);
  }

  permissionLookup(): Observable<StandardResponse<Role[]>> {
    return this.httpWrapperService.get(this.api_permission_lookup_url);
  }

  RoleLookup(): Observable<StandardResponse<Role[]>> {
    return this.httpWrapperService.get(this.api_Role_lookup_url);
  }

  getroleById(roleId: number): Observable<StandardResponse<Role>> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.httpWrapperService.get<Role>(url);
  }
  addRole(role: any): Observable<StandardResponse<Role>> {
    return this.httpWrapperService.post<any>(this.apiUrl, role);
  }

  updateRole(role: any): Observable<StandardResponse<Role>> {
    console.log('role----Data', role);
    const url = `${this.apiUrl}/${role.roleId}`;
    return this.httpWrapperService.put<Role>(url, role);
  }

  deleteRole(roleId: number): Observable<StandardResponse<void>> {
    console.log('roleId', roleId);
    const url = `${this.apiUrl}/${roleId}`;
    return this.httpWrapperService.delete<void>(url);
  }
}
