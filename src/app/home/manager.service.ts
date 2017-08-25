import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Manager } from './manager';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ManagerService {
    database: AngularFireDatabase;
    userkey: string;
    currentUser: string;

    constructor(private authService:AuthService,db: AngularFireDatabase,) {
        this.database=db;
     }
    
    loggedInUser(){
        let user=this.authService.user;
        return user;
    }
    setCurrentUser(email){
       let $pos = email.indexOf('@');
       let shortEmail=email.substr(0, $pos);
       shortEmail=shortEmail.charAt(0).toUpperCase()+shortEmail.charAt(1).toUpperCase() + shortEmail.slice(2);
       return this.database.object(`/users/${shortEmail}`)
        
    }
    // setCurrentUser(user:string,manager:Array<Manager>){
    //     this.currentUser=user;
    //      for(let i=0;i<manager.length; i++){
    
    //       if(manager[i].email.toLowerCase()===user){
    //         this.userkey=manager[i].$key;
    //          console.log(this.userkey)
        
    //         if(manager[i].manager_access){
    //           this.isManager="true";
    //           this.params="aabsvchfo134852f"
    //            if(manager[i].admin_access){
    //           this.isAdmin="true";
    //           return
    //         }
    //         }
           
    //       else{
    //        this.isManager= "false";
    //       this.isAdmin= "false";
    //       this.params="aabsvchfo1egsgu432f"
    //       }
    //       }
         
    //     }
    //   }
}