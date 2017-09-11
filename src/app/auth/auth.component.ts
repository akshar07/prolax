import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  email: string="";
  password: string;
  userList:Array<any>;
  resetPassword:boolean;
  constructor(public authService: AuthService, private router:Router) {}
  username:string="";
  login() {
    this.email=`${this.email}@scu.edu`;  
    this.authService.login(this.email, this.password)
    this.email = this.password = '';    
  }
  logout() {
    this.authService.logout();
  }
  reset(email){
    email=`${email}@scu.edu`;
    alert("email sent to "+email)
    this.authService.resetPassword(email)
  }
  ngOnInit() {}

}
