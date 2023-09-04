import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
// import { Department } from '../../../models/department.model';
import { Shift} from '../../../models/shift.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { PermissionService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { ResponseModel } from '../../../models/response.model';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { Router } from '@angular/router';
import { SortUtil } from '../../../infrastructure/sort.util';
import { Table } from 'primeng/table';
import { SelectModel } from '../../../models/select.model';
import { ShiftService } from '../../../services/shift.service';
import { isJsObject } from '@angular/core/src/change_detection/change_detection_util';

declare var jQuery: any;

@Component({
  selector: 'app-shift-management',
  templateUrl: 'shift-management.component.html',
  styles: []
})
export class ShiftManagementComponent extends BaseComponent implements OnInit {

  constructor(private modalService: BsModalService, private shiftService: ShiftService,
    protected messageService: MessageService, public permissionService: PermissionService,
    public router: Router
  ) {
    super(messageService, permissionService, router);
  }
  parentPage: string = Constant.pages.general.name;
  currentPage: string = Constant.pages.general.childrens.shiftManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: Shift;
  selectedData: Shift;
  isNew: boolean;
  listData: Shift[];
  //
  columns: string[] = ["name", "startTime", "endTime"];
  datasource: Shift[];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  colsShift = [
    { field: 'name', header: 'Tên' },
    { field: 'startTime', header: 'Giờ bắt đầu' },
    { field: 'endTime', header: 'Giờ kết thúc' },
  ]
  //
  parrentShift: SelectModel[];
  selectedParrentShift: Shift;
  @ViewChild('filterGb') filterGb: ElementRef;

  async ngOnInit() {
    // this.parrentShift = await this.shiftService.getSelectModelAsync();
    this.initData();
  }

  async initData() {
    const data = await this.shiftService.getAllAsync();
    if (data) {
      this.datasource = data as Shift[];
      this.totalRecords = this.datasource.length;
      this.listData = this.datasource;
    }

    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.selectedData = null;
    this.isNew = true;
  }

  ngAfterViewInit() {
    // jQuery(document).ready(function () {
    //   jQuery('.i-checks').iCheck({
    //     checkboxClass: 'icheckbox_square-green',
    //     radioClass: 'iradio_square-green',
    //   });
    //   jQuery('.footable').footable();
    // });

  }

  openModel(template: TemplateRef<any>, data: Shift = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new Shift();
      //default value
      this.data.hourStartTime = 0;
      this.data.hourEndTime = 0;
      this.data.minuteStartTime = 0;
      this.data.minuteEndTime = 0;
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  openDeleteModel(template: TemplateRef<any>, data: Shift) {
    this.selectedData = data;
    this.data = this.clone(data);
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  loadLazy(event: LazyLoadEvent) {
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    //imitate db connection over a network
    setTimeout(() => {
      if (this.datasource) {
        var filterRows;

        //filter
        if (event.filters.length > 0)
          filterRows = this.datasource.filter(x => FilterUtil.filterField(x, event.filters));
        else
          filterRows = this.datasource.filter(x => FilterUtil.gbFilterFiled(x, event.globalFilter, this.columns));

        // sort data
        // filterRows = SortUtil.sortAlphanumerical(filterRows, "name");
        filterRows.sort((a, b) => FilterUtil.compareField(a, b, event.sortField) * event.sortOrder);
        this.listData = filterRows.slice(event.first, (event.first + event.rows))
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }

  refresh(dt: Table) {
    dt.reset();
    this.initData();
  }

 async save() {
  let list = [...this.listData];
  if(this.data.hourStartTime <0 && this.data.hourEndTime <0){
    this.messageService.add({ severity: Constant.messageStatus.error, detail: 'Giờ không được nhỏ hơn 0' });
    return;
  }
  if(this.data.hourStartTime >=24 && this.data.hourEndTime >=24){
    this.messageService.add({ severity: Constant.messageStatus.error, detail: 'Giờ không được lớn hơn 24' });
    return;
  }
  if(this.data.minuteStartTime >=60 && this.data.minuteEndTime >=60){
    this.messageService.add({ severity: Constant.messageStatus.error, detail: 'Phút không được lớn hơn 60' });
    return;
  }
  if((this.data.hourStartTime > this.data.hourEndTime) && this.data.isToDate ==undefined){
    this.messageService.add({ severity: Constant.messageStatus.error, detail: 'Phải check qua ngày' });
    return;
  }
  if (this.isNew) {
    this.shiftService.create(this.data).subscribe(x => {
      if (!super.isValidResponse(x)) return;
      var obj = (x.data as Shift);
      this.mapSaveData(obj);
      list.push(this.data);
      this.datasource.push(this.data);
      this.saveClient(list);

    })
  }
  else {
    this.shiftService.update(this.data).subscribe(x => {
      if (!super.isValidResponse(x)) return;
      var obj = (x.data as Shift);
      this.mapSaveData(obj);
      list[this.findSelectedDataIndex()] = this.data;
      this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
      this.saveClient(list);
    })
  }
  // if(this.data.hourStartTime >= this.data.hourEndTime){
  //   this.messageService.add({ severity: Constant.messageStatus.error, detail: 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc' });
  //   return;
  // }else{
 
  // }
}

  mapSaveData(obj: Shift) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
      this.data.name = obj.name;
      this.data.code = obj.code;
      this.data.hourStartTime = obj.hourStartTime;
      this.data.hourEndTime = obj.hourEndTime;
      this.data.minuteStartTime = obj.minuteStartTime;
      this.data.minuteEndTime = obj.minuteEndTime;
      this.data.isToDate = obj.isToDate;
    }
  }
  delete() {
    this.shiftService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);
      this.saveClient(this.listData.filter((val, i) => i != index));
    });
  }

  saveClient(list: Shift[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.bsModalRef.hide();
  }

  clone(model: Shift): Shift {
    let data = new Shift();
    for (let prop in model) {
      data[prop] = model[prop];
      // if(prop == 'startTime' || prop == 'endTime'){
      //   data[prop] = new Date(model[prop]);
      // }else{
      //   data[prop] = model[prop];
      // }
    }
    return data;
  }

  findSelectedDataIndex(): number {
    return this.listData.indexOf(this.selectedData);
  }

  keyDownFunction(event) {
    if ((event.ctrlKey || event.metaKey) && event.which === KeyCodeUtil.charS) {
      this.save();
      event.preventDefault();
      return false;
    }
  }
}
