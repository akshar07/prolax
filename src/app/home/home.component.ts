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
  items: FirebaseListObservable<any[]>;
  users: FirebaseListObservable<any[]>;
  timeline: FirebaseListObservable<any[]>;
  Managers:any[]=[];
  database:AngularFireDatabase;
  project_key:string;
  constructor(db: AngularFireDatabase,
              private pagerService: PagerService,
              public authService: AuthService,
              private router:Router,
              private fb:FormBuilder
              ) {
                    this.database=db;
                    this.timeline = db.list('/projecttimeline');
              
                }
projectsTimeline:Array<any>=[];
getCloseout(projects:Array<Project>){
//   this.projectsName=[];
//   let filteredProject=projects.filter((project)=>{
//   let ukey="";
// Object.keys(project.assigned_to).forEach(function(key,index) {
//     // key: the name of the object key
//     // index: the ordinal position of the key within the object 
//      ukey=project.assigned_to[key][Object.keys(project.assigned_to[key])[0]];
// });

// //     for (let key in project.assigned_to) {
// //       alert(key)
// //       if (project.assigned_to.hasOwnProperty(key)) {
      
      
// //       }
// //      
// // }
//     return ukey===this.userkey;
//   })

   
//   let tasksA=[];
//     let userTasks=[];
//   filteredProject.forEach((project,i)=>{
  
//     // console.log(project.timeline_key);
//   let tasks= this.database.list(`/projecttimeline/${project.timeline_key}/tasks`);
//   tasks.subscribe(task=>{
//       task.forEach((item)=>{
//         tasksA.push(item);
//           userTasks=tasksA;
        
//       });
       
//  userTasks.forEach((task)=>{
//     this.projectsTimeline.push({
//         content:task.taskName,
//         start:task.dueDate,
//         group:i,
      
//     })
     
//     })
//    this.projectsName.push(project.title);

//   tasksA=[];
//    userTasks=[];
 
   

//       // userTasks=[];
//   })
     
//   })
 
//   filteredProject=[];
// //learned {title:project.title,project_number:project.project_number,tasks:userTasks}
  

//   let closedProjects= projects.filter((project)=>{return project.projectStatus==true})


//   for(let i=0;i<closedProjects.length;i++){
//     // console.log(closedProjects[i].$key)
//      let closeOut=this.database.object(closedProjects[i].$key);
//       closeOut.subscribe((item)=>{
//         // console.log(item);
//         let closeKey= item[Object.keys(item)[0]]
//         // console.log(Object.keys(closeKey)[0])
//           // console.log(closeKey[Object.keys(closeKey)[0]])
//       })
//   }
}
// add project
projectStatus:boolean=false;
    addToList() {
     this.projectsTimeline=[];
     this.project_key= this.timeline.push({
                      project_name:this.title, 
                      project_number:this.project_number,
                      manager:this.manager}).key
      this.items.push(
      {
      title: this.title,
      manager:this.manager,
      project_number:this.project_number,
      services: {
        s1: "Building certification",
        s2:"Energy ANalytics"
      },
        startDate:this.startDate,
        endDate:this.endDate,
        client:this.client,
        climate:this.climate,
        timeline_key:this.project_key,
        projectStatus:this.projectStatus,
        combined:this.title+this.manager+this.project_number,
        assigned_to:[]
      }
    );

  }
  reset(){
     this.inputsForm.reset()
  }
  
  getProject(key,project){
    this.project_key=key
    this.project=project;
  }
  tasks: FirebaseListObservable<any[]>;
  project:Project;
  //delete Project
  delete(){
    let time_key=this.project.timeline_key;
    this.tasks = this.database.list(`/projecttimeline/${time_key}`);
    this.tasks.remove();
    this.items.remove(this.project_key).then((project)=>{
    this.timeline.remove(time_key);
    // console.log(this.projectTitles)
    this.getCloseout(this.projectTitles);
    });
  this.projectsTimeline=[];
   this.timelineCmp.destroy()
  this.timelineCmp.ngOnInit();
  }
isManager:string;
  //authenticate manager
  checkManager(manager:Array<Manager>){
    this.authService.user.subscribe((u)=>{
     this.setCurrentUser(u.email, manager)
    })
  }
  setCurrentUser(user:string,manager:Array<Manager>){
   
    this.currentUser=user;
     for(let i=0;i<manager.length; i++){

      if(manager[i].email.toLowerCase()===user){
        this.userkey=manager[i].$key;
         console.log(this.userkey)
    
        if(manager[i].manager_access){
          this.isManager="true";
          this.params="aabsvchfo134852f"
           if(manager[i].admin_access){
          this.isAdmin="true";
          return
        }
        }
       
      else{
       this.isManager= "false";
      this.isAdmin= "false";
      this.params="aabsvchfo1egsgu432f"
      }
      }
     
    }
  }
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
   this.users = this.database.list('/users')
                    this.users.subscribe(res=> {
                    this.Managers=res;
                    this.checkManager(this.Managers)
                  
                 }) 
     this.items = this.database.list('/projects')
                    this.items.subscribe(res=> {
                    this.projectTitles=res;
                    this.getCloseout(this.projectTitles)
                    this.setPage(1);
                 });
          this.inputsForm=this.fb.group({
     project_number:[this.project_number,[Validators.required]],
      title:[this.title,[Validators.required]],
      manager:[this.manager,[Validators.required]],
      startDate:[this.startDate,[Validators.required]],
      endDate:[this.startDate,[Validators.required]],
      client:[this.client,[Validators.required]],
      climate:[this.climate,[Validators.required]]
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