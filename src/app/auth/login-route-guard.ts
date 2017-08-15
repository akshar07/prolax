import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class LoginRouteGuard implements CanActivate {

  constructor(private auth: AngularFireAuth, private router:Router,) {}

  canActivate() {
     if(this.auth.authState){
            return true
     }
          else{
          this.router.navigate(["/"]);
          return false
          }
       
      }
 
  
}