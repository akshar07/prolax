import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  db: AngularFireDatabase;
  resetPassword=false;
  users: FirebaseListObservable<any[]>;
  email: string="";
  password: string;
  userList:Array<any>
  constructor(public authService: AuthService, private router:Router,db: AngularFireDatabase) {
    db=this.db;

  }
username:string="";
  login() {
     this.email=`${this.email}@thorntontomasetti.com`;
       
    this.authService.login(this.email, this.password)
    // this.router.navigate(["home"]);
    
    this.email = this.password = '';    
  }

  logout() {
    this.authService.logout();
    //  this.router.navigate([""]);
  }
  ngOnInit() {
  }
reset(email){
  email=`${email}@thorntontomasetti.com`;
  alert("email sent to "+email)
  this.authService.resetPassword(email)
}
}
