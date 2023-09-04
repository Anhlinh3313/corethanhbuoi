import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { environment } from '../../environments/environment';
import { KeyCodeUtil } from '../infrastructure/keyCode.util';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(private authService : AuthService, private messageService: MessageService) { }

  public username : string;
  public password : string;
  public evTitle: string;
  public evName: string;
  public evCompany: string;
  public hourLogin: number;
  public minuteLogin: number;

  ngOnInit() {
    this.evTitle = environment.title;
    this.evName = environment.name;
    this.evCompany = environment.company;
  }

  public login() {
    var today = new Date();
    this.hourLogin = Number(today.getHours());
    this.minuteLogin = Number(today.getMinutes());
 
    this.authService.login(this.username, this.password, this.hourLogin, this.minuteLogin);
  }

  keyDownFunction(event) {
    if ((event.ctrlKey || event.metaKey) && event.which === KeyCodeUtil.charS) {
      this.login();
      event.preventDefault();
      return false;
    }
  }
}
