import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Country } from '../models/country.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { AuthService } from './auth/auth.service';
import { SelectModel } from '../models/select.model';
import { User } from '../models';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserFilterModel } from '../models/userFilter.model';

@Injectable()
export class UserService extends GeneralService {
  constructor(protected httpClient: HttpClient, private authService: AuthService, protected messageService: MessageService) {
    super(httpClient, "account", messageService);
  }

  changePassWord(currentPassWord: string, newPassWord: string): Observable<ResponseModel> {
    let model = new Object();
    model["userId"] = this.authService.getUserId();
    model["currentPassWord"] = currentPassWord;
    model["newPassWord"] = newPassWord;
    return super.postCustomApi("changePassWord", model);
  }

  async search(model: UserFilterModel) {
    return await super.postCustomApi("search", model).toPromise();
  }

  getEmpByCurrentHub(hubId?: any) {
    let params = new HttpParams();
    params = params.append("hubId", hubId);
    return super.getCustomApi("getEmpByCurrentHub", params);
  }

  async getAllRiderInCenterByHubIdAsync(hubId?: any): Promise<User[]> {
    const res = await this.getEmpByCurrentHub(hubId).toPromise();
    if (!this.isValidResponse(res)) return;
    const data = res.data as User[];
    return data;
  }

  async getSelectModelEmpByCurrentHubAsync(hubId?: any): Promise<SelectModel[]> {
    const res = await this.getAllRiderInCenterByHubIdAsync(hubId);
    const users: SelectModel[] = [];
    users.push({ label: "-- Chọn nhân viên --", value: null });
    if (res) {
      res.forEach((element: User) => {
        users.push({ label: element.code + " - " + element.fullName, value: element.id, data: element });
      });
      return users;
    } else {
      return null;
    }
  }


  getSearchByValue(value: string, id: any) {
    let params = new HttpParams;
    params = params.append("value", value);
    params = params.append("id", id);
    return super.getCustomApi("searchByValue", params);
  }

  async getSearchByValueAsync(value: string, id: any): Promise<any[]> {
    let res = await this.getSearchByValue(value, id).toPromise();
    return res.data as any[];
  }
}