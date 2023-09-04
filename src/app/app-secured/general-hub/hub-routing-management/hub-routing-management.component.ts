import { User } from './../../../models/user.model';
import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { LazyLoadEvent } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { HubService, HubRoutingService, UserService, PermissionService, AuthService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { HubRoutingWardViewModel, GetDatasFromHubViewModel, HubRoutingCreateUpdateViewModel } from '../../../view-model/index';
import { HubRouting, TransferRouting } from '../../../models/index';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { ListStreetJoinByWard } from '../../../models/listStreetJoinByWard.model';
import { StreetJoinByWard } from '../../../models/streetJoinByWard.model';
import { Router } from '@angular/router';
import { SelectModel } from '../../../models/select.model';
import { SortUtil } from '../../../infrastructure/sort.util';
import { Table } from 'primeng/table';
import { environment } from '../../../../environments/environment';
import { ExportExcelHelper } from '../../../infrastructure/exportExcel.helper';
import { StringHelper } from "../../../infrastructure/string.helper";
import { TransferRoutingService } from '../../../services/transferRouting.service';
import * as XLSX from 'xlsx';
type AOA = Array<Array<any>>;
declare var jQuery: any;

@Component({
  selector: 'app-hub-routing-management',
  templateUrl: 'hub-routing-management.component.html',
  styles: []
})
export class HubRoutingManagementComponent extends BaseComponent implements OnInit {
  changeHubName = environment.hub;

  constructor(private modalService: BsModalService, private hubService: HubService,
    protected messageService: MessageService, private hubRoutingService: HubRoutingService,
    private userService: UserService, public permissionService: PermissionService, public router: Router,
    private authService: AuthService, private transferRoutingService: TransferRoutingService
  ) {
    super(messageService, permissionService, router);
  }

  @ViewChild("dt") dt: Table;

  parentPage: string = Constant.pages.generalLocation.name;
  currentPage: string = Constant.pages.generalHub.childrens.hubRoutingManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: HubRouting;
  selectedData: HubRouting;
  isNew: boolean;
  listData: HubRouting[];
  lazyLoadEvent: LazyLoadEvent;

  // Upload excel
  @ViewChild("myInputFiles") myInputFilesVariable: any;
  dataError: any[] = [];
  excelData: any[];
  targetDataTransfer: DataTransfer;
  columnsExcel: any[] = ["Mã tuyến", "Mã nhân viên"];
  lstDeliveryStatus: HubRouting[] = [];
  lstHubRouting: HubRouting[] = [];
  //
  cols = [
    { field: 'code', header: 'Mã', hidden: false },
    { field: 'name', header: 'Tên', hidden: false },
    { field: 'hub.id', header: 'ID ' + this.changeHubName.stationHubLongName + '', hidden: true },
    { field: 'hub.name', header: 'Tên ' + this.changeHubName.stationHubLongName + '', hidden: false },
    { field: 'user.fullName', header: 'Tên nhân viên', hidden: false },
    { field: 'radiusServe', header: 'KM phục vụ', hidden: false }
  ];

  typeRider: SelectModel[] = [{ value: false, label: `Xe máy` }, { value: true, label: `Xe tải` }]

  columns: string[] = ["code", "name"];
  datasource: HubRouting[] = [];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  centerHubs: SelectModel[] = [];
  selectedCenterHub: number;
  //
  provinces: SelectModel[] = [];
  selectedProvinces: any[] = [];
  //
  districts: SelectModel[] = [];
  selectedDistricts: any[] = [];
  //
  poHubs: SelectModel[] = [];
  selectedPoHub: number;
  //
  hubs: SelectModel[] = [];
  selectedHub: number;
  //
  stationHubs: SelectModel[] = [];
  selectedStationHub: number;
  //
  riders: SelectModel[];
  selectedRider: number;
  //
  fillterHubRoutingWards: HubRoutingWardViewModel[];
  hubRoutingWards: HubRoutingWardViewModel[];
  selectedHubRoutingWards: HubRoutingWardViewModel[];
  //
  listStreetJoinByWard: ListStreetJoinByWard;
  hubRoutingStreet: StreetJoinByWard[];
  selectedHubRoutingStreets: StreetJoinByWard[] = [];

  currentUser: User;
  currentUserByID: User;
  currentHubRouting: HubRouting;
  isEnableRider: boolean = true;
  riderName = "";
  userId: number;
  _hubid: number
  code = "";
  name = "";
  hubId: number;
  // Data
  columnsExport = [
    { field: 'code', header: 'Mã tuyến', hidden: false },
    { field: 'userId', header: 'Mã nhân viên', hidden: false }
  ];
  //
  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.initData();
  }

  async initData() {
    // this.hubService.getCenterHub().subscribe(x => {
    //   if (!super.isValidResponse(x)) return;
    //   // this.centerHubs = x.data as Hub[];
    //   this.selectedCenterHub = 0;
    // });

    this.centerHubs = await this.hubService.getSelectModelCenterHubAsync();
    //this.provinces = (await this.provinceService.getSelectModelAllAsync()).filter(f => f.value);
    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.selectedData = null;
    this.isNew = true;
    this.currentUser = await this.userService.getAsync(this.authService.getUserId());
  }

  async loadRider() {
    this.riders = await this.userService.getSelectModelEmpByCurrentHubAsync(this.selectedHub);
    this.dt.filter(this.selectedHub, 'hub.id', 'equals')
  }

  async loadHubRouting() {
    if (!this.selectedPoHub) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn chi nhánh" });
      return;
    }

    this.hubRoutingService.getHubRoutingByPoHubId(this.selectedPoHub).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        this.listData = this.datasource = x.data as HubRouting[];
        // this.totalRecords = this.datasource.length;
        // this.listData = this.datasource.slice(0, this.rowPerPage);
      }
    );
  }

  clearStationHubData() {
    this.datasource = null;
    this.data = null;
    this.selectedData = null;
    this.totalRecords = 0;
    this.listData = null;
    this.selectedHub = null;
    this.dt.filter(null, 'hub.id', 'equals')
    // this.dt.value = null;

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

  async openModel(template: TemplateRef<any>, data: HubRouting = null) {
    if (data) {
      this.riders = await this.userService.getSelectModelEmpByCurrentHubAsync(data.hubId);
      this.riders[0].label = this.riders.find(x => x.value == data.userId).label
      this.riders[0].value = this.riders.find(x => x.value == data.userId).value
      this.riders[0].data = this.riders.find(x => x.value == data.userId).data
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;
      this.selectedStationHub = this.data.hubId;
      await this.loadDatasFromHub();
      // this.
      this.onViewStreet();
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new HubRouting();
      this.selectedStationHub = 0;
      this.selectedRider = 0;
      this.hubRoutingWards = [];
      this.selectedHubRoutingWards = [];
      this.hubRoutingStreet = [];
      this.isEnableRider = true;
      await this.loadDatasFromHub();
    }

    if (this.currentUser.hubId == this.selectedCenterHub || this.currentUser.hubId == this.selectedStationHub || this.currentUser.id == 1) {
      this.selectedRider = data ? data.userId : 0;
      this.isEnableRider = true;
    }
    else {
      if (data && data.user) {
        this.riderName = data.user.code + " - " + data.user.fullName;
      }
      else {
        this.riderName = "";
      }
      //this.isEnableRider = false;
    }

    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-lg' });
  }

  openDeleteModel(template: TemplateRef<any>, data: HubRouting) {
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
    this.lazyLoadEvent = event;

    setTimeout(() => {
      if (this.datasource) {
        var filterRows;

        //filter
        if (event.filters.length > 0)
          filterRows = this.datasource.filter(x => FilterUtil.filterField(x, event.filters));
        else
          filterRows = this.datasource.filter(x => FilterUtil.gbFilterFiled(x, event.globalFilter, this.columns));

        if (this.selectedHub) {
          //
          filterRows = filterRows.filter(x => x.hub.id == this.selectedHub);
        }
        // if (this.selectedProvinces && this.selectedProvinces.length > 0) {
        //   filterRows = filterRows.filter(ff => this.selectedProvinces.find(fd => fd == ff.provinceId));
        // }

        // sort data
        // filterRows = SortUtil.sortAlphanumerical(filterRows, "name");
        filterRows.sort((a, b) => FilterUtil.compareField(a, b, event.sortField) * event.sortOrder);
        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }

  refresh() {
    this.loadHubRouting();
    this.filterGb.nativeElement.value = null;
  }

  isValid(): boolean {
    let isSuccess = true;
    let messages: Message[] = [];

    if (!this.data.code) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa nhập mã" });
      isSuccess = false;
    }

    if (!this.data.name) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa nhập tên" });
      isSuccess = false;
    }

    if (!this.selectedStationHub) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa chọn trạm" });
      isSuccess = false;
    } else if (!this.selectedStationHub) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa chọn trạm" });
      isSuccess = false;
    }

    // if (this.selectedHubRoutingWards.length === 0) {
    //   messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa chọn phường xã" });
    //   isSuccess = false;
    // }

    if (!isSuccess) {
      this.messageService.addAll(messages);
    }

    return isSuccess;
  }

  save() {
    if (!this.isValid()) return;

    let list = [...this.listData];
    let wards = [];
    let model = new HubRoutingCreateUpdateViewModel();

    model.streetJoinIds = [];

    this.selectedHubRoutingWards.forEach(x => wards.push(x.wardId));
    model.code = this.data.code;
    model.concurrencyStamp = this.data.concurrencyStamp;
    model.hubId = this.selectedStationHub;
    model.id = this.data.id;
    model.name = this.data.name;
    model.codeConnect = this.data.codeConnect;
    model.radiusServe = this.data.radiusServe;
    model.isTruckDelivery = this.data.isTruckDelivery;
    if (this.selectedRider)
      model.userId = this.selectedRider;
    else
      model.userId = null;
    model.wardIds = wards;
    if (this.selectedHubRoutingStreets.length > 0) {
      model.streetJoinIds = this.selectedHubRoutingStreets.map(x => x.id);
    }

    if (this.isNew) {
      this.hubRoutingService.create(model).subscribe(x => {
        if (!super.isValidResponse(x)) return;
        var obj = x.data as HubRouting;
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
      });
    }
    else {
      this.hubRoutingService.update(model).subscribe(x => {
        if (!super.isValidResponse(x)) return;
        var obj = x.data as HubRouting;
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
        this.hubRoutingStreet = [];
        this.selectedHubRoutingStreets = [];
      });
    }
  }

  mapSaveData(obj: HubRouting) {
    if (obj) {
      this.data.id = obj.id;
      this.data.hub = this.stationHubs.find(x => x.value == this.selectedStationHub).data;
      this.riders.slice(0, 1)
      this.data.user = this.riders.find(x => x.value == this.selectedRider).data;
      this.data.concurrencyStamp = obj.concurrencyStamp;
    }
  }

  delete() {
    this.hubRoutingService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);
      this.saveClient(this.listData.filter((val, i) => i != index));
    });
  }

  saveClient(list: HubRouting[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.selectedStationHub = 0;
    this.hubRoutingWards = [];
    this.selectedHubRoutingWards = [];
    this.selectedRider = 0;
    this.bsModalRef.hide();
  }

  async changeCenterHub() {
    this.clearStationHubData();
    this.poHubs = await this.hubService.getSelectModelPoHubByCenterIdbAsync(this.selectedCenterHub);
    this.stationHubs = [];
  }

  async changePoHub() {
    this.dt.filter(null, 'hub.id', 'equals')
    this.loadHubRouting();
    this.stationHubs = this.hubs = await this.hubService.getSelectModelAsync(this.selectedPoHub);
    let findHub = this.poHubs.find(f => f.value == this.selectedPoHub);
    if (findHub) {
      this.stationHubs.push({ value: null, label: `-- Chọn ${environment.hub.poHubLongName} --` });
      this.stationHubs.push(findHub);
    }
  }

  async loadDatasFromHub() {
    let hubRoutingId: number = 0;
    if (this.data && this.data) hubRoutingId = this.data.id;
    this.provinces = [];
    let x = await this.hubRoutingService.getDatasFromHubAsync(this.selectedStationHub, hubRoutingId, this.data.isTruckDelivery);
    if (!super.isValidResponse(x)) return;
    let obj = x.data as GetDatasFromHubViewModel;
    this.hubRoutingWards = obj.wards;
    this.hubRoutingWards = SortUtil.sortAlphanumerical(this.hubRoutingWards, "wardName");
    this.selectedHubRoutingWards = obj.wards.filter(x => obj.selectedWardIds.indexOf(x.wardId) !== -1);
    this.selectedProvinces = [];
    this.selectedHubRoutingWards.map(
      map => {
        let checkData = this.selectedProvinces.find(f => f == map.provinceId);
        if (!checkData) {
          this.selectedProvinces.push(map.provinceId);
        }
      }
    );
    this.hubRoutingWards.map(
      map => {
        let findPro = this.provinces.find(f => f.value == map.provinceId);
        if (!findPro) {
          this.provinces.push({ value: map.provinceId, label: map.provinceName });
        }
      }
    );
    this.fillterHubRoutingWard();
  }

  fillterHubRoutingWard() {
    this.districts = [];
    this.selectedDistricts = [];
    if (this.selectedProvinces) {
      this.selectedHubRoutingWards = this.selectedHubRoutingWards.filter(f => this.selectedProvinces.indexOf(f.provinceId) >= 0);
      this.fillterHubRoutingWards = this.hubRoutingWards.filter(f => this.selectedProvinces.indexOf(f.provinceId) >= 0);
      this.fillterHubRoutingWards.map(
        map => {
          let findDis = this.districts.find(f => f.value == map.districtId);
          if (!findDis) this.districts.push({ value: map.districtId, label: map.districtName });
        }
      );
      this.selectedHubRoutingWards.map(
        map => {
          if (!this.selectedDistricts.find(f => f == map.districtId)) {
            this.selectedDistricts.push(map.districtId);
          }
        }
      );
      this.changeWard();
    }
  }

  changeWard() {
    if (this.selectedDistricts) {
      this.selectedHubRoutingWards = this.selectedHubRoutingWards.filter(f => this.selectedDistricts.indexOf(f.districtId) >= 0);
      this.fillterHubRoutingWards = this.hubRoutingWards.filter(f => this.selectedDistricts.indexOf(f.districtId) >= 0);
    }
  }

  onViewStreet() {
    const selectedHubRoutingWardIds = this.selectedHubRoutingWards.map(x => x.wardId).join(",");

    if (selectedHubRoutingWardIds) {
      if (!this.selectedData) {
        this.selectedData = new HubRouting();
        this.selectedData.id = 0;
      }

      this.hubRoutingService.getDataStreetJoinByWard(this.selectedStationHub, this.selectedData.id, selectedHubRoutingWardIds).subscribe(
        x => {
          if (!super.isValidResponse(x)) return;
          this.listStreetJoinByWard = x.data as ListStreetJoinByWard;
          const selectedStreetIds = this.listStreetJoinByWard.selectedStreetIds;
          this.selectedHubRoutingStreets = [];
          this.hubRoutingStreet = this.listStreetJoinByWard.streets;
          if (selectedStreetIds) {
            if (selectedStreetIds.length > 0) {
              selectedStreetIds.forEach(x => {
                this.hubRoutingStreet.forEach(e => {
                  if (e.streetId === x) {
                    this.selectedHubRoutingStreets.push(e);
                  }
                })
              });
            }
          }
        }
      );
    }
  }

  async changeStationHub() {
    this.loadDatasFromHub();
    var a = this.selectedStationHub;
    this.riders = await this.userService.getSelectModelEmpByCurrentHubAsync(this.selectedStationHub);
    this.dt.filter(this.selectedHub, 'hub.id', 'equals')
  }

  clone(model: HubRouting): HubRouting {
    let data = new HubRouting();
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

  // Upload excel
  onFileChange(evt: any) {
    // this.value = 0;

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.targetDataTransfer = target;

    if (!this.isValidChangeFile()) return;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      this.excelData = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.setData();
    };
    reader.readAsBinaryString(target.files[0]);
  }
  setData() {
    // console.log(this.excelData);
    if (this.excelData.length == 0) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Không tìm thấy dữ liệu upload, vui lòng kiểm tra lại!"
      })
      return;
    }
    if (!this.isValidChangeFile()) return;
    const columns = this.excelData[0] as string[];

    this.columnsExcel.forEach(col => {
      if (columns.indexOf(col) == -1) {
        this.messageService.add({
          severity: Constant.messageStatus.error, detail: "File thiếu colum: " + col + ", vui lòng kiểm tra lại: " //check coloum
        });
        return;
      }
    })

    for (let i = 0; i < this.excelData.length; i++) { // set row 
      if (i >= 1) {
        const row = this.excelData[i];
        if (row[0] != null && row[1] != null) {
          let list: HubRouting = new HubRouting();
          list.code = row[0];
          list.userId = row[1];
          this.lstDeliveryStatus.push(list);
        }
      }
    }
  }
  clearData() {
    // this.value = 0;
    this.excelData = [];
    this.lstDeliveryStatus = [];
    this.myInputFilesVariable.nativeElement.value = "";
    this.lstHubRouting = [];
  }
  async uploadExcel() {
    let countSuccess = 0;
    let countUnSuccess = 0;
    let total = this.lstDeliveryStatus.length;
    for (let i = 0; i < total; i++) {
      console.log(this.lstDeliveryStatus.length);
      console.log(this.lstDeliveryStatus[i].userId);
      if (this.lstDeliveryStatus[i].userId != null) {
        this.currentUser = await this.userService.getAsync(this.lstDeliveryStatus[i].userId);
        if (this.currentUser == null) {
          this.messageService.add({
            severity: Constant.messageStatus.error, detail: "Không tìm thấy mã nhân viên trong hệ thống"
          });
          return;
        }
        else {
          this.userId = this.currentUser.id; //set userid
        }
      }
      else {
        this.messageService.add({
          severity: Constant.messageStatus.error, detail: "Vui lòng điền mã nhân viên"
        });
        return;
      }
      if (!StringHelper.isNullOrEmpty(this.lstDeliveryStatus[i].code)) {
        this.code = this.lstDeliveryStatus[i].code;
        let res = await this.hubRoutingService.GetHubRoutingByCode(this.code).subscribe(x => {
          this.currentHubRouting = x.data as HubRouting;
          if (this.currentHubRouting.code == null) {
            this.messageService.add({
              severity: Constant.messageStatus.error, detail: "Không tìm thấy mã tuyến trong hệ thống"
            });
            return;
          }
          else {
            this.code = this.currentHubRouting.code; //code
            this.name = this.currentHubRouting.name;
            this.hubId = this.currentHubRouting.hubId; // hubid
            this._hubid = this.currentHubRouting.id
            let wards = [];
            let model = new HubRoutingCreateUpdateViewModel();
            model.id = this._hubid
            model.streetJoinIds = [];
            model.userId = this.userId;
            model.code = this.code;
            model.hubId = this.hubId;
            model.name = this.name;
            model.codeConnect = null;
            model.radiusServe = 0;
            model.isTruckDelivery = false;
            model.wardIds = wards;
            if (this.selectedHubRoutingStreets.length > 0) {
              model.streetJoinIds = this.selectedHubRoutingStreets.map(x => x.id);
            }
            this.hubRoutingService.update(model).subscribe(x => {
              if (x.isSuccess) {
                this.code = null; //code
                this.name = null;
                this.hubId = null; // hubid
                this._hubid = null
                ++countSuccess;
              } else {
                ++countUnSuccess;
                this.dataError.push(model);
              }
            });
          }
        });
      }
      else {
        this.messageService.add({
          severity: Constant.messageStatus.error, detail: "Vui lòng điền mã tuyến"
        });
        return;
      }


    }
    setTimeout(() => {
      if (countSuccess > 0) {
        this.messageService.add({
          severity: Constant.messageStatus.success,
          detail: ("Upload thành công " + countSuccess + "/" + total + " tuyến."),
        });
        this.loadHubRouting();
      }
      if (countUnSuccess > 0) {
        var dataEX = ExportExcelHelper.mapDataToExport(this.dataError, this.columnsExport);
        ExportExcelHelper.exportXLSX(dataEX, "Danh sách tuyến upload không thành công");
        this.dataError = [];
        this.messageService.add({
          severity: Constant.messageStatus.error,
          detail: ("Upload không thành công " + countUnSuccess + "/" + total + " tuyến."),
        });

      }
    }, 1000);
    
  }

  isValidChangeFile(): boolean {
    let result: boolean = true;
    let messages: Message[] = [];

    if (!this.targetDataTransfer || this.myInputFilesVariable.nativeElement.value === "") {
      this.messageService.add({
        severity: Constant.messageStatus.warn, detail: "Vui lòng chọn file upload."
      });
      result = false;
    }
    if (this.targetDataTransfer && this.targetDataTransfer.files.length > 1) {
      this.messageService.add({
        severity: Constant.messageStatus.warn, detail: "Không thể upload nhiều file cùng lúc"
      });
      this.myInputFilesVariable.nativeElement.value = "";
      result = false;
    }

    if (messages.length > 0) {
      this.messageService.addAll(messages);
    }
    return result;
  }

  maxRecordExport = 500;
  async exportCSV(dt?: any) {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      noDownload: false,
    };
    if (dt) {
      let fileName = "Danh sách tuyến";
      if (this.listData.length > 0) {
        if (this.listData.length > this.maxRecordExport) {
          let data: any[] = [];
          let count = Math.ceil(this.listData.length / this.maxRecordExport);
          let promise = [];

          for (let i = 1; i <= count; i++) {
            promise.push(await this.hubRoutingService.getHubRoutingByPoHubId(this.selectedPoHub));
          }
          Promise.all(promise).then(rs => {
            rs.map(x => {
              data = data.concat(x);
            });

            let dataE = data.reverse();
            var dataEX = ExportExcelHelper.mapDataToExport(dataE, this.columnsExport);
            ExportExcelHelper.exportXLSX(dataEX, "Danh sách tuyến");
          });
        } else {

          this.hubRoutingService.getHubRoutingByPoHubId(this.selectedPoHub).subscribe(
            x => {
              var dataEX = ExportExcelHelper.mapDataToExport(x.data, this.columnsExport);
              ExportExcelHelper.exportXLSX(dataEX, "Danh sách tuyến");
            }
          );
        }
      } else {
        dt.exportCSV();
      }
    }
  }
}
