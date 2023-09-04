import { Injectable } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { Constant } from '../../infrastructure/constant';
import { User } from '../../models/user.model';

@Injectable()
export class AuthService {

  constructor(private persistenceService : PersistenceService, private httpClient : HttpClient, private router : Router, private messageService: MessageService) { }

  public isLoggedIn() : boolean {
    var isLogged = this.persistenceService.get(Constant.auths.isLoginIn, StorageType.LOCAL);
    if (isLogged == 'true') {
      return true;
    }
    return false;
  }

  public login(userName : string, password : string, hourLogin: number, minuteLogin: number) {
    var loginObj = new Object();
    loginObj["UserName"] = userName;
    loginObj["PassWord"] = password;
    loginObj["HourLogin"] = hourLogin;
    loginObj["MinuteLogin"] = minuteLogin;
    this.httpClient.post("api/Account/SignIn", loginObj).subscribe((ret: any) => {
      console.log(ret);
      if (ret["isSuccess"] === 1) {

        this.messageService.add({severity:'success', summary:'Đăng nhập thành công', detail:'Đăng nhập thành công.'});
        var retData = ret["data"];
        this.persistenceService.set(Constant.auths.isLoginIn, 'true', {type: StorageType.LOCAL});  
        this.persistenceService.set(Constant.auths.token, retData["token"], {type: StorageType.LOCAL});
        this.persistenceService.set(Constant.auths.userId, retData["userId"], {type: StorageType.LOCAL});  
        this.persistenceService.set(Constant.auths.userName, retData["userName"], {type: StorageType.LOCAL});
        this.persistenceService.set(Constant.auths.fullName, retData["userFullName"], {type: StorageType.LOCAL});
        var routing = "";
        this.router.navigate([routing]);
      } else {
        this.messageService.add({severity:'warn', summary:'Đăng nhập không thành công', detail: ret.message});
      }
    });
    
  }

  public logout() {
    this.persistenceService.remove(Constant.auths.isLoginIn, StorageType.LOCAL);
    this.persistenceService.remove(Constant.auths.token, StorageType.LOCAL);
    this.persistenceService.remove(Constant.auths.userId, StorageType.LOCAL);
    this.persistenceService.remove(Constant.auths.userName, StorageType.LOCAL);
    var routing = Constant.pages.login.alias;
    this.router.navigate([routing]);
  }

  public getToken(): string {
    return this.persistenceService.get(Constant.auths.token, StorageType.LOCAL);
  }

  public getUserId(): number {
    return this.persistenceService.get(Constant.auths.userId, StorageType.LOCAL);
  }

  public getUserName(): string {
    return this.persistenceService.get(Constant.auths.userName, StorageType.LOCAL);
  }

  public getFullName(): string {
    return this.persistenceService.get(Constant.auths.fullName, StorageType.LOCAL);
  }
  public checkHourShift(userId: number, hourLogin: number, minuteLogin: number){
    var checkHourObj = new Object();
    checkHourObj["UserId"] = userId;
    checkHourObj["HourLogin"] = hourLogin;
    checkHourObj["MinuteLogin"] = minuteLogin;
    this.httpClient.post("api/Account/CheckHourShift", checkHourObj).subscribe((ret) => {
      console.log(ret);
      if (ret["isSuccess"] === 1) {      
      } else {
        this.logout();
        // this.messageService.add({severity:'warn', summary:'Đăng nhập không thành công', detail:'Đăng nhập không thành công.'});
      }
    });
  }
}
