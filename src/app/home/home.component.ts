import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { PagerService } from "pagination";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

import * as _ from 'underscore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Project } from './project';
import { Manager } from './manager';
import { Projects } from './projects';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { ManagerService } from './manager.service';
import {trigger, state, style, transition, animate} from '@angular/animations';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { UsertimelineComponent } from '../usertimeline/usertimeline.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
export class HomeComponent implements OnInit   {
  showingArchived: boolean;
  @ViewChild(DropdownComponent) dropdown: DropdownComponent;
  @ViewChild(NotificationsComponent) notifications: NotificationsComponent;
  @ViewChild(UsertimelineComponent) timeline: UsertimelineComponent;
  userImage: any;
  projectMembers: any;
  projectListObs: Observable<any>;
  userName: any;
  user:string;
  params: string;
  isAdmin: string;
  dateInvalid: boolean;
  currentUser: string;
  Managers:any[]=[];
  database:AngularFireDatabase;
  project_key:string;
  projectStatus:boolean=false;
  constructor(
              private userService:UserService,
              private projectService:ProjectService,
              private pagerService: PagerService,
              public authService: AuthService,
              private router:Router,
              private fb:FormBuilder,
              private managerService:ManagerService
              ) {
              
                }
                menuState:string = 'out';
                toggleMenu() {
                   this.menuState = this.menuState === 'out' ? 'in' : 'out';
                }                
projectsTimeline:Array<any>=[];
// add project

getProjectInfo(id,members){
this.project_key=id;
this.projectMembers=members;
}
showArchived(){
  this.showingArchived=true;
  this.projectListObs= this.projectService.getProjects(this.user,true)
  this.projectNotesId=this.user;
  this.getProjectNotes()
}
showCurrent(){
  this.showingArchived=false;
  this.projectListObs= this.projectService.getProjects(this.user,false);
  this.projectNotesId=this.user;
  this.getProjectNotes()
}
archiveProject(projectId,members){
  this.projectService.archiveProject(this.project_key,this.projectMembers)
  this.timeline.destroy();
  this.timeline.ngOnInit();
  this.notifications.ngOnInit();
}
  addToList() {
    let project_key=this.projectService.addProject(
       {
          course:this.course,
          title: this.title,
          projectStatus:this.projectStatus,
          startDate:new Date(),
          endDate:this.endDate,
          combined:this.title+this.course,
          project_members:this.projectMembers,
          archived:false
        },this.title,this.course,this.projectMembers
    );

    this.projectsTimeline=[];
    this.projectService.addTimeline({
      project_name:this.title, 
      course:this.course,
      tasks:[]
    },project_key)
  }
  reset(){
     this.inputsForm.reset()
  }
  keys=[];
  getProject(key,project,members){
   members.map(member=>{
     
     this.keys=[...this.keys,member.key];
   })
   console.log(this.keys)
    this.project_key=key
    this.project=project;
    this.projectMembers=members;
    this.projectService.getEditProject(key)
      .subscribe(project=>{
        console.log(project)
        this.title=project.title;
        this.course=project.course;
        this.startDate=project.startDate;
        this.endDate=project.endDate;
      })
      console.log(this.title)
  }
  project:Project;
   //delete Project
  delete(){
    this.projectService.deleteProject(this.project_key,this.keys);
    this.projectsTimeline=[];
    this.timeline.destroy();
    this.timeline.ngOnInit();
    this.notifications.ngOnInit();
  }
  checkLoggedUser(){
    let loggedEmail;
    let userObs=this.managerService.loggedInUser();
    userObs.subscribe((user)=>{
    let currentUser=this.managerService.setCurrentUser(user.email);
    currentUser.subscribe((user=>{
      this.isAdmin=`${user.admin_access}`;
      this.userName=user.user_name;
      this.user=user.short_name;
      this.notesObs=this.projectService.getProjectnotes(this.user);
      this.userImage=user.imageUrl;
      this.params="aabsvchfo134852f";
      this.projectListObs= this.projectService.getProjects(this.user,false)
      this.projectNotesId=this.user;
    }))
    })
  }
  // get/ post project notes
  projectNoteInput:string;
  projectNotesId:string;
  getProjectNotes(){
    this.notesObs=this.projectService.getProjectnotes(this.projectNotesId);
    let element = document.getElementById('scrollMe');
    }
  addNoteToProject(){
    if (this.projectNotesId==='myNotes'){
      this.projectService.addProjectNote(this.user,this.projectNoteInput);
    }
    else{
      this.projectService.addProjectNote(this.projectNotesId,this.projectNoteInput);
    }
    this.projectNoteInput="";
  }
  deleteNote(noteKey){
   
    if (this.projectNotesId==='myNotes'){
      this.projectService.deleteNote(this.user,noteKey);
    }
    else{
      this.projectService.deleteNote(this.projectNotesId,noteKey);
    }
    
  }
isManager:string;
  //authenticate course
  addUser(){
    this.router.navigate(["addUsers"])
  }
//child routing
  goToProject(project) {
    this.router.navigate(['projectDetail', project.$key,`${this.params}`]);
  };
inputsForm:FormGroup;
startDate:Date=new Date();
title:string;
course:string;
project_number:string;
endDate:Date;
status:string;
selectedUsers(users){
 this.projectMembers=users;
}
notesObs:any;
ngOnInit() {
  this.inputsForm=this.fb.group({
      title:[this.title,[Validators.required]],
      course:[this.course,[Validators.required]],
      startDate:[this.startDate,[Validators.required]],
      endDate:[this.startDate,[Validators.required]],
  });
this.checkLoggedUser();
let userObs=this.userService.getUsers();
userObs.subscribe((user)=>{
this.Managers=user;
});
//get projects
this.authService.user.subscribe((val=>{this.routeThis(val)}))
}
  routeThis(val){
      if(!val){
      this.router.navigate([""]);
    }
  }
  goToLearning(){
    this.router.navigate(["learning"])
  }
checkDate(){
  if(new Date(this.endDate).getTime() - new Date().getTime()<0 ){
    this.dateInvalid=true;
  }
  else{
    this.dateInvalid=false;
  }
}
editProject(projectId){
  
}

}