import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { PagerService } from "pagination";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import * as _ from 'underscore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Project } from './project';
import { Manager } from './manager';
import { Projects } from './projects';
import { TimelineComponent } from '../timeline/timeline.component';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { ManagerService } from './manager.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit   {
  @ViewChild(TimelineComponent) timelineCmp:TimelineComponent;

  projectsName: Array<string>=[];
  userkey: string;
  params: string;
  isAdmin: string;
  dateInvalid: boolean;
  currentUser: string;
  projects:Observable<any>;
  projectTitles:Array<Project>=[];
  tasks: FirebaseListObservable<any[]>;
  timeline: FirebaseListObservable<any[]>;
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
                    // this.database=db;
                    // this.timeline = db.list('/projecttimeline');
              
                }
projectsTimeline:Array<any>=[];
// add project
  addToList() {
    let project_key=this.projectService.addProject(
      {
          project_number:this.project_number,
          manager:this.manager,
          title: this.title,
          projectStatus:this.projectStatus,
          client:this.client,
          climate_zone:this.climate,
          services:[],
          assigned_to:[],
          startDate:this.startDate,
          endDate:this.endDate,
          combined:this.title+this.manager+this.project_number,
        }
    )
    this.projectsTimeline=[];
    this.projectService.addTimeline({
      project_name:this.title, 
      project_number:this.project_number,
      manager:this.manager,
      client:this.client,
      tasks:[]
    },project_key)
  }
  reset(){
     this.inputsForm.reset()
  }
  getProject(key,project){
    this.project_key=key
    this.project=project;
  }
  project:Project;
   //delete Project
  delete(){
    this.projectService.deleteProject(this.project_key);
    this.projectsTimeline=[];
    this.timelineCmp.destroy()
    this.timelineCmp.ngOnInit();
  }
  checkIfManager(){
    let email;
    let userObs=this.managerService.loggedInUser();
    userObs.subscribe((user)=>{
    let currentUser=this.managerService.setCurrentUser(user.email);
    currentUser.subscribe((user=>{
      this.isAdmin=`${user.admin_access}`;
      this.isManager=`${user.manager_access}`;
      if(user.manager_access){
        this.params="aabsvchfo134852f";
      }
      else{
        this.params="aabsvchfo1egsgu432f";
      }
    }))
    })
    

  }
isManager:string;
  //authenticate manager
  // checkManager(manager:Array<Manager>){
  //   this.authService.user.subscribe((u)=>{
  //    this.setCurrentUser(u.email, manager)
  //   })
  // }
  // setCurrentUser(user:string,manager:Array<Manager>){
  //   this.currentUser=user;
  //    for(let i=0;i<manager.length; i++){

  //     if(manager[i].email.toLowerCase()===user){
  //       this.userkey=manager[i].$key;
  //        console.log(this.userkey)
    
  //       if(manager[i].manager_access){
  //         this.isManager="true";
  //         this.params="aabsvchfo134852f"
  //          if(manager[i].admin_access){
  //         this.isAdmin="true";
  //         return
  //       }
  //       }
       
  //     else{
  //      this.isManager= "false";
  //     this.isAdmin= "false";
  //     this.params="aabsvchfo1egsgu432f"
  //     }
  //     }
     
  //   }
  // }
  addUser(){
    this.router.navigate(["addUsers"])
  }
    // pager object
  pager: any = {};
    // paged items
  pagedItems: Project[];

//search filter
transform(filter:Project){
  if(!filter){
 
 this.pagedItems = this.projectTitles;
  this.pager = this.pagerService.getPager(this.projectTitles.length, 1);
 this.pagedItems = this.projectTitles.slice(this.pager.startIndex, this.pager.endIndex + 1);

  }
  let temp:Array<any>=this.projectTitles;
  temp=temp.filter((item: Project) =>this.applyFilter(item, filter));

  this.pager = this.pagerService.getPager(temp.length, 1);
 this.pagedItems = temp.slice(this.pager.startIndex, this.pager.endIndex + 1);
}
 applyFilter(project: Project, filter: Project=new Project()): boolean {
  
    for (let field in filter) {
   
      if (filter[field]) {

          if (project.combined.toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
       
      }
    }
    return true;
}
//pagination
setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
      return;
  }
  // get pager object from service
  this.pager = this.pagerService.getPager(this.projectTitles.length, page);
  // get current page of items
  this.pagedItems = this.projectTitles.slice(this.pager.startIndex, this.pager.endIndex + 1);

}

filter:Project=new Project();
//child routing
  goToProject(project) {
    this.router.navigate(['projectDetail', project.$key,`${this.params}`]);
  };
inputsForm:FormGroup;
startDate:Date=new Date();
title:string;
manager:string;
project_number:string;
endDate:Date;
status:string;
client:string;
climate:string
  ngOnInit() {
    this.inputsForm=this.fb.group({
      project_number:[this.project_number,[Validators.required]],
       title:[this.title,[Validators.required]],
       manager:[this.manager,[Validators.required]],
       startDate:[this.startDate,[Validators.required]],
       endDate:[this.startDate,[Validators.required]],
       client:[this.client,[Validators.required]],
       climate:[this.climate,[Validators.required]]
    });
  //get users and check manager
  this.checkIfManager()
  let userObs=this.userService.getUsers();
  userObs.subscribe((user)=>{
  this.Managers=user;
  // this.checkManager(this.Managers);
  })
  //get projects
  let projectObs=this.projectService.getProjects();
  projectObs.subscribe((project)=>{
    this.projectTitles=project;
    this.setPage(1);
  })
  this.authService.user.subscribe((val=>{this.routeThis(val)}))
   }
  routeThis(val){
      if(!val){
      this.router.navigate([""]);
    }
  }
checkDate(){
 
  if(new Date(this.endDate).getTime() - new Date(this.startDate).getTime()<0 ){
    this.dateInvalid=true;
  }
  else{
    this.dateInvalid=false;
  }
}

}