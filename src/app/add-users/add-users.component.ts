import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUSersComponent implements OnInit {
  user: FirebaseObjectObservable<any>;
  database: AngularFireDatabase;
  password: string="";
  user_name:string="";
  email:string="";
  imageUrl:string="";
  users: FirebaseListObservable<any[]>;
  userList=[];
  userObject={
  email: "",
  user_name:"",
  admin_access:false,
  manager_access:false,
  imageUrl:""
  }
  constructor(public authService: AuthService, private router:Router,db: AngularFireDatabase) {
  this.database=db;
   }
userObj$;
userKey:string;
showUser=false;
getUser(key:string){
this.showUser=true;
this.userKey=key
  let user;
this.database.object(`users/${key}`).subscribe((retrievedUser)=>{
    user=retrievedUser;
  });
  this.userObject=user;

}
deleteUser(){
  this.database.object(`users/${this.email}`).remove();
 alert("User Deleted")
}
saveUser(){
  this.database.object(`users/${this.userKey}`).update({
  user_name:this.userObject.user_name,
  email:this.userObject.email,
  admin_access:this.userObject.admin_access,
  manager_access:this.userObject.manager_access,
  imageUrl:this.userObject.imageUrl
  })
  alert("saved ")
}
    signup() {
    let user=this.email;
    this.email=`${this.email}@thorntontomasetti.com`
    this.authService.signup(this.email, this.password, this.user_name);
    this.user=this.database.object(`/users/${user}`);
    this.user.set({
    user_name:this.user_name,
    email:this.email,
    admin_access:false,
    manager_access:false,
    imageUrl:this.imageUrl,
    short_name:user
    })
    this.userObject.email=this.email;
    this.userObject.imageUrl=this.imageUrl;
    this.userObject.user_name=this.user_name;
    alert("user added")
   this.userObject.email = this.password = '';
  }
  ngOnInit() {
    this.users=this.database.list("/users");
    this.users.subscribe((user)=>{
      this.userList.push(user);
  
    })
  this.authService.user.subscribe((val=>{this.routeThis(val)}))
    
   }
    routeThis(val){
       if(!val){
        this.router.navigate([""]);
     }
  }
toHome(){
  this.router.navigate(["/home"])
}

}
