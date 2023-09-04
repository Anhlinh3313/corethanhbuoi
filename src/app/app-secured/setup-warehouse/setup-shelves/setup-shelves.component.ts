import { Component, OnInit, TemplateRef } from '@angular/core';
import { Constant } from '../../../infrastructure/constant';
import { ShelvesService } from '../../../services/shelves.service';
import { HubService, PermissionService } from '../../../services';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router } from '@angular/router';
import { Hub } from '../../../models';
import { SelectModel } from '../../../models/select.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-setup-shelves',
  templateUrl: './setup-shelves.component.html',
  styleUrls: ['./setup-shelves.component.css']
})
export class SetupShelvesComponent extends BaseComponent implements OnInit {
  showShelves: any;
  
  constructor(protected messageService: MessageService,
    public modalService: BsModalService,
    public permissionService: PermissionService,
    public shelvesService: ShelvesService,
    public stationHub: HubService,
    public router: Router) {
      super(messageService, permissionService, router);
    }
    parentPage: string = Constant.pages.setup_warehouse.name;
    currentPage: string = Constant.pages.setup_warehouse.childrens.setup_shelves.name;
    bsModalRef: BsModalRef;
    bsModalCreatRef: BsModalRef;
  ///
  ShelvesArr: any[] = [];
  list_filter: any[] = [];
  selectedShelves: any;
  selected_creat_She: any;
  //////
  creat_Shel_Id ="";
  creat_Shel_Name ="";
  ///
  hubStationArr: SelectModel[] = [];
  selectedHubArr: any[] = [];
  selectedHub: any;
  selected_creat_Hub: any;
  
  iseditDiv: boolean = true;
  async ngOnInit() {
    this.ShelvesArr = [];
    await this.getAllHubStation();
    await this.loadData();
  }
  async getAllShelves() {
    let arrCols = ["Hub"];
    let res = await this.shelvesService.getAll(arrCols).toPromise();
    return res.data;
  }
  async  getAllHubStation() {
    this.stationHub.getStationHub().subscribe(
      x => {
        if (!this.isValidResponse(x)) return;
        let listDatas = x.data as Hub[];
        this.hubStationArr.push({ value: -1, label: 'Tất cả', data: null });
        listDatas.map(m => { this.hubStationArr.push({ value: m.id, label: m.name, data: m }) });
        
      }
    )
  }
  async loadData() {
    this.selectedHubArr = [];
    this.selectedHub = null;
    let res = await this.getAllShelves();
    if(res) this.ShelvesArr = res; 
  }
  async loaddatabyHub(id: any)
  {
    let arrCols = ["Hub"];
    if(id>=0)
    {
      let res = await this.shelvesService.getByHubId(id,arrCols).toPromise();
      this.ShelvesArr = res.data;
    } else this.loadData();
  }
  async getHubById(id: any) {
    let res = await this.stationHub.get(id).toPromise();
    return res.data;
  }
  async check_codeShe(data: any) {
    if(this.ShelvesArr.length>0)
    {
      this.ShelvesArr.forEach(x => {
        if (x.code == data) return false;
      });
    }
      return true;
  }
  async create_Shelves() { 
    var new_shelves = new Object();
    this.checkError();
    if (this.check_codeShe(this.creat_Shel_Id))
      if ((this.creat_Shel_Id != null) && (this.creat_Shel_Name != null) && (this.selected_creat_Hub != null)) {
        new_shelves['Code'] = this.creat_Shel_Id;
        new_shelves['Name'] = this.creat_Shel_Name;
        new_shelves['HubId'] = this.selected_creat_Hub;
        let res = await this.shelvesService.createAsync(new_shelves);
        if (res) {
          this.messageService.add({
            severity: Constant.messageStatus.success,
            detail: "Đã tạo mới thành công"
          });
        } 
        this.refresh();
        this.loadData(); 
      }
  }
  async update_Shelves() {
    this.checkError();
    if ((this.creat_Shel_Id != null) && (this.creat_Shel_Name != null) && (this.selected_creat_Hub != null)) {
      this.selectedShelves.code = this.creat_Shel_Id;
      this.selectedShelves.name = this.creat_Shel_Name;
      this.selectedShelves.hubId = this.selected_creat_Hub;

      let rece = await this.shelvesService.updateAsync(this.selectedShelves);
      if (rece) {
        this.messageService.add({
          severity: Constant.messageStatus.success,
          detail: "Đã cập nhật thành công"
        });
      } 
      if (rece != null) {
        this.iseditDiv = true;
        this.refresh();
        this.loadData();
        this.bsModalCreatRef.hide()
      }
    }

  }
  async delete_Shelves(id: any) {
    let res = await this.shelvesService.get(id).toPromise();
    this.selectedShelves = res.data;

    if (this.selectedShelves != null) {
      let res = await this.shelvesService.deleteAsync(this.selectedShelves);
      if (res) {
        this.messageService.add({
          severity: Constant.messageStatus.success,
          detail: "Đã xóa kệ thành công"
        });
      } 
      this.loadData();
      this.bsModalRef.hide();
    }
  }
  async showinfo(id: any) {
    let res = await this.shelvesService.get(id).toPromise();
    this.selectedShelves = res.data;
    if (this.selectedShelves != null) {
      this.creat_Shel_Id = this.selectedShelves.code;
      this.creat_Shel_Name = this.selectedShelves.name;
      // let rece = await this.getHubById(this.selectedShelves.HubId);
      this.selected_creat_Hub = this.selectedShelves.hubId; 
      this.iseditDiv = false;
    }
  }
  openDeleteModel(template: TemplateRef<any>, data: any) {
    this.selectedShelves = data;
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }
  opetemplateCreat(template: TemplateRef<any>, isedit: boolean,id: any)
  {
    if(isedit){
      this.iseditDiv = true;
      this.selected_creat_Hub = this.selectedHub;
    }
    else { 
        this.showinfo(id);
    }
    this.bsModalCreatRef = this.modalService.show(template, { class: 'inmodal edit-pup animated bounceInRight modal-s' });
  }
  refresh(){
    this.creat_Shel_Id = "";
      this.creat_Shel_Name = "";
  }
  checkError(){
    if(this.selected_creat_Hub==null)
    {
      this.messageService.add({
        severity: Constant.messageStatus.error,
        detail: "Chưa chọn kho hàng"
      });
      return;
    } 
    if(this.creat_Shel_Id=="")
    {
      this.messageService.add({
        severity: Constant.messageStatus.error,
        detail: "Chưa nhập mã kệ"
      });
      return;
    }
    if(this.creat_Shel_Name=="")
    {
      this.messageService.add({
        severity: Constant.messageStatus.error,
        detail: "Chưa nhập tên kệ"
      });
      return;
    }
  }
}
