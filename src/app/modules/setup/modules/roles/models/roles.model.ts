export interface Role {
  roleId: number; // Unique role identifier
  roleType: string,
  roleName: string; // Name of the role
  roleCode: string;
  permission: string;
  status: string; // Indicates if role is active
  accessPrev: number;
  permId: number;
  option: string;

}
