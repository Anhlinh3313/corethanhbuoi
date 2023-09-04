import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
//
import { RoleManagementComponent } from './role-management/role-management.component';
import { DepartmentManagementComponent } from './department-management/department-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserRelationManagementComponent } from './user-relation-management/user-relation-management.component';
import { ShiftManagementComponent } from './shift-management/shift-management.component';

const routes: Routes = [
  { path: Constant.pages.general.childrens.roleManagement.alias, component: RoleManagementComponent },
  { path: Constant.pages.general.childrens.departmentManagement.alias, component: DepartmentManagementComponent },
  { path: Constant.pages.general.childrens.userManagement.alias, component: UserManagementComponent },
  { path: Constant.pages.general.childrens.userRelationManagement.alias, component: UserRelationManagementComponent },
  { path: Constant.pages.general.childrens.shiftManagement.alias, component: ShiftManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class GeneralRoutingModule { }
