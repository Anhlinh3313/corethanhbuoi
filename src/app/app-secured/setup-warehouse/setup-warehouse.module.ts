import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupShelvesComponent } from './setup-shelves/setup-shelves.component';
import { SetupCompartmentsComponent } from './setup-compartments/setup-compartments.component';
import { SetupWarehouseRoutingModule } from './setup-warehouse-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, DropdownModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ShelvesService } from '../../services/shelves.service';
import { HubService } from '../../services';
import { SharedModule } from '../../shared/shared.module';
import { CompartmentsService } from '../../services/compartment.service';
//import { BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SetupWarehouseRoutingModule,
    DataTableModule,
    DropdownModule,
    TableModule,
    SharedModule
  ],
  declarations: [
    SetupShelvesComponent, 
    SetupCompartmentsComponent
  ],
  providers: [
    ShelvesService,
    HubService,
    CompartmentsService,
    
  ]

})
export class SetupWarehouseModule { }
