import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { PermissionService, UserService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { BaseComponent } from '../../../shared/components/baseComponent';
//google.maps
import { Router } from '@angular/router';
import { UserFilterModel } from '../../../models/userFilter.model';
import { Table } from 'primeng/table';
import { UserRelation } from '../../../models/userRelation.model';
import { UserRelationService } from '../../../services/userRelation.service';
import { User } from '../../../models';
import { AutoComplete } from 'primeng/primeng';

@Component({
  selector: 'app-user-relation-management',
  templateUrl: 'user-relation-management.component.html',
  styles: []
})
export class UserRelationManagementComponent extends BaseComponent implements OnInit {
  constructor(protected messageService: MessageService, private userService: UserService,
    private userRelationService: UserRelationService, public permissionService: PermissionService, public router: Router
  ) {
    super(messageService, permissionService, router);
  }

  @ViewChild("dt") dt: Table;

  cols: any = ["User", "UserRelationUser"];

  userFilterModel: UserFilterModel;

  parentPage: string = Constant.pages.general.name;
  currentPage: string = Constant.pages.general.childrens.userRelationManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  //
  datasource: UserRelation[];
  totalRecords: number;
  pageSize: number = 20;
  pageNum: number = 1;
  //
  listUser: User[] = [];
  selectedUser: User;
  resultsUser: string[] = [];
  inputUser: string = null;
  //
  listUserRelation: User[] = [];
  selectedUserRelation: User;
  resultsUserRelation: string[] = [];
  inputUserRelation: string = null;
  //
  @ViewChild("autoUserRelation") autoUserRelationRef: AutoComplete;

  ngOnInit() {
    this.initData();
  }

  async initData() {
  }

  async fillterInputUser(event) {
    let inputUser = event.query;
    if (inputUser) {
      this.listUser = await this.userService.getSearchByValueAsync(inputUser, null);
      if (this.listUser) {
        this.resultsUser = [];
        this.listUser.map(
          map => {
            this.resultsUser.push(`${map.code} - ${map.name}`);
          }
        )
      }
    }
  }

  async fillterInputUserRelation(event) {
    let inputUser = event.query;
    if (inputUser) {
      this.listUserRelation = await this.userService.getSearchByValueAsync(inputUser, null);
      if (this.listUserRelation) {
        this.resultsUserRelation = [];
        this.listUserRelation.map(
          map => {
            this.resultsUserRelation.push(`${map.code} - ${map.name}`);
          }
        )
      }
    }
  }

  SelectedUser() {
    this.selectedUser = null;
    if (this.inputUser) {
      let findUser = this.listUser.find(f => (`${f.code} - ${f.name}`) == this.inputUser);
      this.selectedUser = findUser;
      this.loadData();
    } else {
      this.selectedUser = null;
    }
  }

  SelectedUserRelation() {
    this.selectedUserRelation = null;
    if (this.inputUserRelation) {
      let findUser = this.listUserRelation.find(f => (`${f.code} - ${f.name}`) == this.inputUserRelation);
      this.selectedUserRelation = findUser;
    } else {
      this.selectedUserRelation = null;
    }
  }

  async loadData() {
    let cols: string[] = ["UserRelationUser"];
    if (this.selectedUser) {
      await this.userRelationService.getUserRelationByUser(this.selectedUser.id, this.pageSize, this.pageNum, cols).subscribe(
        res => {
          if (!super.isValidResponse(res)) return;
          this.datasource = res.data;
          this.totalRecords = res.dataCount;
        }
      )
    }
  }

  onPageChange(event: any) {
    this.pageNum = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  Add() {
    this.messageService.clear();
    if (!this.selectedUser || !this.selectedUser.id) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn nhân viên!" });
      return;
    }
    if (!this.selectedUserRelation || !this.selectedUserRelation.id) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn nhân viên cấp dưới!" });
      return;
    }
    let newUserRelation: UserRelation = new UserRelation();
    newUserRelation.userId = this.selectedUser.id;
    newUserRelation.userRelationId = this.selectedUserRelation.id;
    this.userRelationService.create(newUserRelation).subscribe(
      x => {
        if (!this.isValidResponse(x)) return;
        this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Thêm mới thành công.' });
        this.autoUserRelationRef.domHandler.findSingle(this.autoUserRelationRef.el.nativeElement, 'input').focus();
        this.autoUserRelationRef.domHandler.findSingle(this.autoUserRelationRef.el.nativeElement, 'input').select();
        let userRelation = x.data as UserRelation;
        if (this.datasource && this.datasource.length < this.pageSize) {
          userRelation.userRelationUser = this.cloneUser(this.selectedUserRelation);
          userRelation.userRelationUser.fullName = userRelation.userRelationUser.name;
          this.datasource.unshift(userRelation);
        }
        this.totalRecords++;
        this.selectedUserRelation = null;
        this.inputUserRelation = null;
      }
    );
  }

  cloneUser(model: User): User {
    let data = new User();
    for (let prop in model) {
      data[prop] = model[prop];
    }
    return data;
  }

  remove(data: UserRelation) {
    if (!data || !data.id) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Dữ liệu sai, không thể xóa!" });
      return;
    }
    this.userRelationService.delete(data).subscribe(
      x => {
        if (!this.isValidResponse(x)) return;
        let indexOf = this.datasource.indexOf(data);
        this.datasource.splice(indexOf, 1);
        this.messageService.add({ severity: Constant.messageStatus.success, detail: "Đã xóa thành công." });
      }
    )
  }
}
