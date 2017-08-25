import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../home/manager.service';
import { UserService } from '../home/user.service';
import { Router } from '@angular/router';
import { ProjectService } from '../home/project.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  userId: any;
  params: string;
  isAdmin: string;
  isManager:string;
  tasks=[];
  notifications=[];
  constructor(private managerService:ManagerService,
              private userService:UserService,
              private router: Router,
              private projectService:ProjectService) { }
  checkIfManager(){
    this.tasks=[];
    this.notifications=[];
    let email;
    let userObs=this.managerService.loggedInUser();
    userObs.subscribe((user)=>{
    let currentUser=this.managerService.setCurrentUser(user.email);
    currentUser.subscribe((user=>{
      this.isAdmin=`${user.admin_access}`;
      this.isManager=`${user.manager_access}`;
      this.tasks=user.tagged;
      this.userId=user.short_name
      let taskKeys;
      taskKeys=Object.keys(this.tasks);
      taskKeys.forEach(key => {
        this.notifications.push(this.tasks[key])
      });
      if(user.manager_access){
        this.params="aabsvchfo134852f";
      }
      else{
        this.params="aabsvchfo1egsgu432f";
      }
    }))
    })
  }
  clearOne(taskId){
    alert()
    this.projectService.clearOneNotification(this.userId,taskId);
    this.checkIfManager();
  }
  goToTask(projectKey){
        this.router.navigate(['projectDetail',projectKey,`${this.params}`]);

  }
  ngOnInit() {
  this.checkIfManager();
  }

}
