import { Component, OnInit } from '@angular/core';
import { AuthService } from '../app/services/auth/auth.service';
import { PersistenceService, StorageType } from 'angular-persistence';
//
import { Constant } from '../app/infrastructure/constant';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent  implements OnInit {
  constructor(private authService: AuthService, private persistenceService: PersistenceService) { }
  title = 'app';
  public hourLogin: number;
  public minuteLogin: number;
  ngOnInit() {
    var userId = this.persistenceService.get(Constant.auths.userId, StorageType.LOCAL);
   if(userId){
    var today = new Date();
    this.hourLogin = Number(today.getHours());
    this.minuteLogin = Number(today.getMinutes());
    this.authService.checkHourShift(userId, this.hourLogin, this.minuteLogin);
   } 
  }
}
