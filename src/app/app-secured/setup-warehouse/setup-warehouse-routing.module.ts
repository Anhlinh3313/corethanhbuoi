import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
import { SetupShelvesComponent } from './setup-shelves/setup-shelves.component';
import { SetupCompartmentsComponent } from './setup-compartments/setup-compartments.component';
//


const routes: Routes =  [
  { path: Constant.pages.setup_warehouse.childrens.setup_shelves.alias, component: SetupShelvesComponent  },
  { path: Constant.pages.setup_warehouse.childrens.setup_compartments.alias, component: SetupCompartmentsComponent  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: []
})
export class SetupWarehouseRoutingModule { }
