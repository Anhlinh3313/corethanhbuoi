import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/components/common/messageservice';
import { ProvinceService, CountryService, PermissionService, HubService } from '../../../services';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { ShelvesService } from '../../../services/shelves.service';
import { CompartmentsService } from '../../../services/compartment.service';
import { Constant } from '../../../infrastructure/constant';
import { SelectModel } from '../../../models/select.model';
import { Hub } from '../../../models';

@Component({
  selector: 'app-setup-compartments',
  templateUrl: './setup-compartments.component.html',
  styleUrls: ['./setup-compartments.component.css']
})
export class SetupCompartmentsComponent extends BaseComponent implements OnInit {
  bsModalCreatRef: BsModalRef;

  constructor(private modalService: BsModalService, 
    protected messageService: MessageService,
    public shelvesService : ShelvesService,
    public stationHub : HubService,
    public compartmentService : CompartmentsService,
    public permissionService: PermissionService,
    public router: Router) {
    super(messageService, permissionService, router);
  }
  ///
  ShelvesArr : SelectModel[] = [];
  selectedShelvesArr: any[] = [];
  creat_ShelvesArr: any[] = [];
  selectedShelves : any;
  selected_Shelves_creat : any = null;
  selected_filter_shel : any = null; 
  ///
  CompartmentArr : any[] = [];
  creat_compartment_code : any;
  creat_compartment_name : any;
  selectedCompart : any;
  list_filter : any;
  ///
  hubStationArr: SelectModel[] = [];
  selectedHubArr: any[] = [];
  selectedHub: any;
  selected_creat_Hub: any;
  iseditDiv: boolean = true;

  bsModalRefcom: BsModalRef;
  parentPage: string = Constant.pages.setup_warehouse.name;
  currentPage: string = Constant.pages.setup_warehouse.childrens.setup_compartments.name;
  ngOnInit() {
    this.getAllHubStation();
    this.getAllShelves();
    this.loadData();
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
  async getAllShelves()
  {
      this.shelvesService.getAll().subscribe(
      x => {
        if (!this.isValidResponse(x)) return;
        let listDatas = x.data as Hub[];
        this.ShelvesArr.push({ value: -1, label: 'Tất cả', data: null });
        listDatas.map(m => { this.ShelvesArr.push({ value: m.id, label: m.name, data: m }) });
        
      }
    )
  }
  async getAllCompartment()
  {
    let arrCols = ["Shelves,Shelves.Hub"];
     let res = await this.compartmentService.getAll(arrCols).toPromise();
     return res.data;
  }
  
  async loadData()
  {
    
    this.selectedHubArr =[];
    this.selectedShelvesArr = [];
    this.selectedShelves = null;
    this.selected_filter_shel = null;
    this.CompartmentArr = await this.getAllCompartment();
    // if(this.CompartmentArr.length>0)
    // {
    //   for(let i=0; i<this.CompartmentArr.length;i++)
    //     if(this.CompartmentArr[i].shelves.hubId!=null)
    //     {
    //         let hubItem = await this.getHubById(this.CompartmentArr[i].shelves.hubId);
    //         this.selectedHubArr.push(hubItem);
    //     }
    // }
}
    
  async getHubById(id : any)
  {
    let res = await this.stationHub.get(id).toPromise();
    return res.data;
  }
  async getShelvesById(id : any)
  {
    let res = await this.shelvesService.get(id).toPromise();
    return res.data;
  }
  async getCompartmentById(id : any)
  {
    
    let res = await this.compartmentService.get(id).toPromise();
    return res.data;
  }
  async loadShelByHub(id: any)
  {
    let listShel = [];
    this.selected_Shelves_creat = null;
    let arrCols = ["Hub"];
    await this.shelvesService.getByHubId(id,arrCols).toPromise().then(
      x => {
        if (!this.isValidResponse(x)) return;
        let listDatas = x.data as Hub[];
        listShel.push({ value: -1, label: 'Tất cả', data: null });
        listDatas.map(m => { listShel.push({ value: m.id, label: m.name, data: m }) });
        
      }
    )
    return listShel;
  }
  async create_Compart()
  {
    var new_compartment = new Object();
    this.checkError();
    if (this.check_codeShe(this.creat_compartment_code))
      if ((this.creat_compartment_code != null) && (this.creat_compartment_name != null) && (this.selected_creat_Hub != null) && (this.selected_Shelves_creat != null)) {
        new_compartment['Code'] = this.creat_compartment_code;
        new_compartment['Name'] = this.creat_compartment_name;
        new_compartment['ShelvesId'] = this.selected_Shelves_creat;
        console.log(new_compartment);
        let res = await this.compartmentService.createAsync(new_compartment);
        if (res) {
          this.messageService.add({
            severity: Constant.messageStatus.success,
            detail: "Đã tạo mới thành công"
          });
        } else{
          this.messageService.add({
            severity: Constant.messageStatus.error,
            detail: "Tạo mới không thành công"
          });
        }
        this.loadData();
        this.refresh();
      }
  }
  async update_Compart(id:any)
  {
    this.checkError();
    if ((this.creat_compartment_code != null) && (this.creat_compartment_name != null) && (this.selected_Shelves_creat != null) && (this.selected_creat_Hub != null)) {
      this.selectedCompart.Code = this.creat_compartment_code;
      this.selectedCompart.Name = this.creat_compartment_name;
      this.selectedCompart.ShelvesId = this.selected_Shelves_creat;

      let rece = await this.compartmentService.updateAsync(this.selectedCompart);
      if (rece != null) {
        this.messageService.add({
          severity: Constant.messageStatus.success,
          detail: "Đã cập nhật thành công"
        });
        this.iseditDiv = true;
        this.refresh();
        this.loadData();
        this.bsModalCreatRef.hide()
      }
    }
  }
  loaddatabyShelves(id: any)
  {
    for(let i=0;i<this.CompartmentArr.length;i++)
    if(this.CompartmentArr[i].ShelvesId==id)
    this.list_filter.push(this.ShelvesArr[i]);
    if(this.list_filter.length>0)
        this.CompartmentArr = this.list_filter;
  }
 async delete_Compartment(id:any)
  {
    let res = await this.compartmentService.get(id).toPromise();
    this.selectedCompart = res.data;

    if (this.selectedCompart != null) {
     let res = await this.compartmentService.deleteAsync(this.selectedCompart);
    if(res)
     this.messageService.add({
      severity: Constant.messageStatus.success,
      detail: "Đã xóa ngăn thành công"
    });
     this.loadData();
     this.bsModalRefcom.hide();
    }
  }
  openDeleteModel(template: TemplateRef<any>, data: any)
  {
    this.selectedCompart = data;
    
    this.bsModalRefcom = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }
  async  showinfo(id:any)
  {
        this.selectedCompart = await this.getCompartmentById(id);
        let res = await this.shelvesService.get(this.selectedCompart.shelvesId).toPromise();
        var data = res.data as any;
        this.creat_compartment_code = this.selectedCompart.code;
        this.creat_compartment_name = this.selectedCompart.name;
        this.creat_ShelvesArr = await this.loadShelByHub(data.hubId); 
        this.selected_creat_Hub = data.hubId;
        this.selected_Shelves_creat = this.selectedCompart.shelvesId; 
        this.iseditDiv = false;
  }
  async check_codeShe(data: any) {
    this.CompartmentArr.forEach(x => {
      if (x.code == data) {
        this.messageService.add({
          severity: Constant.messageStatus.error,
          detail: "Mã ngăn đã tồn tại trong kệ"
        });
        return false;
      }
    });
    return true;
  }
  async getComByHub(id: any)
  {
    let arrCols = ["Shelves,Shelves.Hub"];
     let res = await this.compartmentService.getCompartmentByHubId(id,arrCols).toPromise();
     return res.data;
  }
  async getComByShelves(id: any)
  {
    let arrCols = ["Shelves,Shelves.Hub"];
     let res = await this.compartmentService.getCompartmentByShelvesId(id,arrCols).toPromise();
     return res.data;
  }
  async filterbyHub(id: any)
  {
    if(id<0 || id==null) await this.loadData();
    else 
      {
        this.CompartmentArr = await this.getComByHub(id);
        this.selectedShelvesArr = await this.loadShelByHub(id);
      } 
  }
  async filterbyShelves(id: any)
  {
    if(id>=0)
    {
      this.CompartmentArr = await this.getComByShelves(id);
    }else this.filterbyHub(this.selectedHub);

  }
  async opetemplateCreat(template: TemplateRef<any>, isedit: boolean,id: any)
  {
    if(isedit) 
    {
      this.iseditDiv = true;
      this.refresh();
      this.selected_creat_Hub = this.selectedHub;
      this.creat_ShelvesArr =await this.loadShelByHub(this.selected_creat_Hub);
      this.selected_Shelves_creat = this.selected_filter_shel;
    }
    else { 
        this.showinfo(id);
    }
    this.bsModalCreatRef = this.modalService.show(template, { class: 'inmodal edit-pup animated bounceInRight modal-s' });
  }
  refresh(){
    this.creat_compartment_code="";
    this.creat_compartment_name=""; 
    // this.selectedHub = null;
    // this.selected_filter_shel = null;
  }
  checkError(){
    if(this.selected_creat_Hub==null || this.selected_creat_Hub == -1 )
    {
      this.messageService.add({
        severity: Constant.messageStatus.error,
        detail: "Chưa chọn kho hàng"
      });
      return;
    }
    if(this.selected_Shelves_creat==null || this.selected_Shelves_creat == -1)
    {
      this.messageService.add({
        severity: Constant.messageStatus.error,
        detail: "Chưa chọn kệ hàng"
      });
      return;
    }
    if(this.creat_compartment_code=="")
    {
      this.messageService.add({
        severity: Constant.messageStatus.error,
        detail: "Chưa nhập mã ngăn"
      });
      return;
    }
    if(this.creat_compartment_name=="")
    {
      this.messageService.add({
        severity: Constant.messageStatus.error,
        detail: "Chưa nhập tên ngăn"
      });
      return;
    }
  }
  async load_creat_shel(id){
    this.creat_ShelvesArr = await this.loadShelByHub(id);
  }
}
