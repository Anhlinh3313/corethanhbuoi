import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { Province, TransferRouting, Hub } from '../../../models';
import { LazyLoadEvent } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { PermissionService, HubService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { Router } from '@angular/router';
import { SelectModel } from '../../../models/select.model';
import { Table } from 'primeng/table';
import { TransferRoutingService } from '../../../services/transferRouting.service';

declare var jQuery: any;

@Component({
  selector: 'app-transfer-routing-management',
  templateUrl: 'transfer-routing-management.component.html',
  styles: []
})
export class TransferRoutingManagementComponent extends BaseComponent implements OnInit {

  constructor(private modalService: BsModalService, protected messageService: MessageService,
    private transferRoutingService: TransferRoutingService,
    private hubService: HubService,
    public permissionService: PermissionService,
    public router: Router
  ) {
    super(messageService, permissionService, router);
  }

  parentPage: string = Constant.pages.generalHub.name;
  currentPage: string = Constant.pages.generalHub.childrens.transferRoutingManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: TransferRouting;
  selectedData: TransferRouting;
  isNew: boolean;
  listData: TransferRouting[];
  //
  columns: string[] = ["code", "name", "fromHub.name", "toHub.name"];
  datasource: TransferRouting[];
  totalRecords: number;
  rowPerPage: number = 10;
  hubs: SelectModel[] = [];
  //
  colstransferRouting = [
    { field: 'code', header: 'Mã' },
    { field: 'name', header: 'Tên' },
    { field: 'fromHub.name', header: 'Từ Bưu cục / Kho' },
    { field: 'toHub.name', header: 'Đến Bưu cục / Kho' },
  ]
  //
  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.initData();
  }

  async initData() {
    let includes = [];
    includes.push(Constant.classes.includes.transferRouting.fromHub);
    includes.push(Constant.classes.includes.transferRouting.toHub);

    const transferRoutings = await this.transferRoutingService.getAllAsync(includes);
    if (transferRoutings) {
      this.datasource = transferRoutings as TransferRouting[];
      this.totalRecords = this.datasource.length;
      this.listData = this.datasource;
    }

    this.hubs = await this.hubService.getSelectModelStationHubbAsync();

    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.selectedData = null;
    this.isNew = true;
  }

  ngAfterViewInit() {
    jQuery(document).ready(function () {
      jQuery('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
      });
      jQuery('.footable').footable();
    });
  }

  openModel(template: TemplateRef<any>, data: TransferRouting = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new TransferRouting();
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  openDeleteModel(template: TemplateRef<any>, data: TransferRouting) {
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
        this.listData = filterRows.slice(event.first, (event.first + event.rows));
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }

  refresh(dt: Table) {
    dt.reset();
    this.initData();
  }

  save() {
    if (!this.data.code) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Vui lòng nhập mã tuyến' });
      return false;
    } else if (!this.data.name) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Vui lòng nhập tên tuyến' });
      return false;
    } else if (!this.data.fromHubId) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Vui lòng chọn từ BC/KHO' });
      return false;
    } else if (!this.data.toHubId) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Vui lòng nhập đến BC/KHO' });
      return false;
    } else if (this.data.toHubId === this.data.fromHubId) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'BC/KHO từ và đến không được trùng nhau!' });
      return false;
    }
    let list = [...this.listData];
    if (list.find(f => f.fromHubId === this.data.fromHubId && f.toHubId === this.data.toHubId && f.id !== this.data.id)){
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'BC/KHO từ và đến đã được tạo trước đó!' });
      return false;
    }
      if (this.isNew) {
        this.transferRoutingService.create(this.data).subscribe(x => {
          if (!super.isValidResponse(x)) return;
          var obj = (x.data as TransferRouting);
          let fromHub = this.hubs.find(f => f.value == obj.fromHubId);
          if (fromHub) this.data.fromHub = fromHub.data;
          let toHub = this.hubs.find(f => f.value == obj.toHubId);
          if (toHub) this.data.toHub = toHub.data;
          this.mapSaveData(obj);
          list.push(this.data);
          this.datasource.push(this.data);
          this.saveClient(list);
        });
      }
      else {
        this.transferRoutingService.update(this.data).subscribe(x => {
          if (!super.isValidResponse(x)) return;
          var obj = (x.data as TransferRouting);
          let fromHub = this.hubs.find(f => f.value == obj.fromHubId);
          if (fromHub) this.data.fromHub = fromHub.data;
          let toHub = this.hubs.find(f => f.value == obj.toHubId);
          if (toHub) this.data.toHub = toHub.data;
          this.mapSaveData(obj);
          list[this.findSelectedDataIndex()] = this.data;
          this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
          this.saveClient(list);
        });
      }
  }

  mapSaveData(obj: TransferRouting) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
    }
  }

  delete() {
    this.transferRoutingService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);
      this.saveClient(this.listData.filter((val, i) => i != index));
    });
  }

  saveClient(list: TransferRouting[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.bsModalRef.hide();
  }

  compareFn(c1: Province, c2: Province): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  clone(model: TransferRouting): TransferRouting {
    let data = new TransferRouting();
    for (let prop in model) {
      data[prop] = model[prop];
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
