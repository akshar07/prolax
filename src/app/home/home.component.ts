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
  userName: any;
  userTasks: any[];
  @ViewChild(TimelineComponent) timelineCmp: TimelineComponent;
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
              
                }
projectsTimeline:Array<any>=[];
//project category
projectCategory=["Energy Modeling",
                "CFD",
                "Daylighting",
                "LEED consulting",
                "Compliance modeling",
                "Hygrothermal analysis",
                "Heat Transfer analysis",
                "Envelop Consulting",
                "Sustainability Strategies"];
selectedSector:string;
market_sector=["Aviation",
               "Commercial",
               "Cultural/Institutional",
               "Education K-12",
               "Government",
               "Healthcare",
               "Higher Education",
               "Hospitality/Gaming",
               "Mission Critical",
               "Sports",
               "Transportation"];
ProjectArea:number;
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
          category:this.category,
          market_sector:this.selectedSector,
          area:this.ProjectArea
        }
    )
    this.projectsTimeline=[];
    this.projectService.addTimeline({
      project_name:this.title, 
      project_number:this.project_number,
      manager:this.manager,
      client:this.client,
      category:this.category,
      market_sector:this.selectedSector,
      area:this.ProjectArea,
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
    this.timelineCmp.destroyTimeline()
    this.timelineCmp.ngOnInit()
  }
  checkIfManager(){
    let email;
    let userObs=this.managerService.loggedInUser();
    userObs.subscribe((user)=>{
    let currentUser=this.managerService.setCurrentUser(user.email);
    currentUser.subscribe((user=>{
      this.isAdmin=`${user.admin_access}`;
      this.isManager=`${user.manager_access}`;
      this.userName=user.user_name;
      if(user.manager_access){
        this.params="aabsvchfo134852f";
      }
      else{
        this.params="aabsvchfo1egsgu432f";
      }
    }))
    })
  }
  loadData(){
    let m;
    return setTimeout(()=>{
      m=this.isManager;
      return m
    },800);
  }
isManager:string;
  //authenticate manager


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
allManagers;
filter:Project=new Project();
//child routing
  goToProject(project) {
    this.router.navigate(['projectDetail', project.$key,`${this.params}`]);
  };
  Prcategory(){
  }
  getManagers(){
    this.allManagers=this.projectService.getAllManagers();
  }
inputsForm:FormGroup;
startDate:Date=new Date();
title:string;
manager:string;
project_number:string;
endDate:Date;
status:string;
client:string;
climate:string;
category:string;
  ngOnInit() {
    this.inputsForm=this.fb.group({
      project_number:[this.project_number,[Validators.required]],
       title:[this.title,[Validators.required]],
       manager:[this.manager,[Validators.required]],
       startDate:[this.startDate,[Validators.required]],
       endDate:[this.startDate,[Validators.required]],
       client:[this.client,[Validators.required]],
       climate:[this.climate,[Validators.required]],
       categoryType:[this.category],
       market_sector:[this.selectedSector],
       area:[this.ProjectArea]
    });

  let userObs=this.userService.getUsers();
  userObs.subscribe((user)=>{
  this.Managers=user;
  })
  //get projects
  let projectObs=this.projectService.getProjects();
  projectObs.subscribe((project)=>{
    this.projectTitles=project;
    this.setPage(1);
    this.getManagers()
    //get users and check manager
    this.checkIfManager()
  });
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
 
  if(new Date(this.endDate).getTime() - new Date(this.startDate).getTime()<0 ){
    this.dateInvalid=true;
  }
  else{
    this.dateInvalid=false;
  }
}

}