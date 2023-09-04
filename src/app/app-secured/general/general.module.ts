import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { GeneralRoutingModule } from './general.routing';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TreeTableModule, DataTableModule, DropdownModule, MultiSelectModule, AutoCompleteModule } from 'primeng/primeng';
//
import { CountryService, ProvinceService, DistrictService, WardService, RoleService, DepartmentService, UserService,HubService } from '../../services';
//
import { RoleManagementComponent } from './role-management/role-management.component';
import { DepartmentManagementComponent } from './department-management/department-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserRelationManagementComponent } from './user-relation-management/user-relation-management.component';
import {FocusModule} from 'angular2-focus';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { UserRelationService } from '../../services/userRelation.service';
import { ShiftManagementComponent } from './shift-management/shift-management.component';
import { CalendarModule } from 'primeng/primeng';
import { ShiftService } from '../../services/shift.service';
const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: '',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GeneralRoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    TreeTableModule,
    SharedModule,
    DataTableModule,
    DropdownModule,
    MultiSelectModule,
    FocusModule.forRoot(),
    TableModule,
    AutoCompleteModule,
    CalendarModule
  ],
  declarations: [
    RoleManagementComponent,
    DepartmentManagementComponent,
    UserManagementComponent,
    UserRelationManagementComponent,
    ShiftManagementComponent
  ],
  entryComponents: [
  ],
  providers: [
    CountryService,
    ProvinceService,
    DistrictService,
    WardService,
    RoleService,
    DepartmentService,
    UserService,
    UserRelationService,
    HubService,
    ShiftService
  ]

})
export class GeneralModule { }
