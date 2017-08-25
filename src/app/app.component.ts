import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Rx";
import {Http} from '@angular/http'
import * as _ from 'underscore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import {trigger, state, style, transition, animate} from '@angular/animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class AppComponent implements OnInit   {

  constructor(  public authService: AuthService,
                private router:Router,
                private auth: AngularFireAuth,
                private http:Http
                ){
            
        if(this.auth.authState){
       this.auth.authState.subscribe((auth)=>{
         if(auth){
           this.authService.isLoggedIn=true;
         }
          else{
           this.authService.isLoggedIn=false;
          }
       })
      }
  }
  menuState:string = 'out';
  toggleMenu() {
     this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }
  logout(){
    this.authService.logout();
  }
  goToProjects(){
  this.router.navigate(['home']);
  }
  checkLogin(){
    if(this.authService.isLoggedIn){
      return true;
    }
    else{
      return false;
    }
  }
   ngOnInit() {}
    

}
