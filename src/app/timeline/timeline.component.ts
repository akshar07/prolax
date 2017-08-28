import { Component, OnInit, Input } from '@angular/core';
import { NgModule, ElementRef} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/Rx'

import { Project } from '../home/project';
import { AngularFireDatabase } from 'angularfire2/database';
import { ProjectService } from '../home/project.service';
import { UserService } from '../home/user.service';
import { ManagerService } from '../home/manager.service';
declare var vis: any;


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  load: boolean;
  projectNames = [];
  tasks = [];
  currentUser: string;
  userTasks: any[];
  @Input()
  Key:string;
  @Input()
  manager:boolean;
  projectsTimeline: any=[];
  groups: any;
  timeline: any;
  name:string;
  constructor(private element: ElementRef,private projectService:ProjectService,private managerService:ManagerService) {
  }
  taskA=[];
  items=new vis.DataSet([]);
  options:any;
  render(){  
    this.items = new vis.DataSet(this.finaltasks);
    this.options = {start:new Date()};  
    this.timeline = new vis.Timeline(this.element.nativeElement, this.items,this.groups ,this.options);
    let startDate=new Date();
    let endDate= startDate.setDate(startDate.getDate()+8*24*60*60*1000);
  }
destroy(){
   this.timeline.destroy();
}
finaltasks=[];
formatTasks(task,i){
  this.finaltasks.push({
    start:task.dueDate,
    content:task.taskName,
    group:i,
    className:task.categoryType
  })
}
destroyTimeline(){
  this.timeline.destroy();
}
renderTimeline(){
  this.load=true;
  setTimeout(()=>{this.render();this.load=false;},1000);
}


managerTasks(){

  this.projectNames=[];
  this.managerService.loggedInUser()
 
  .subscribe((user)=>{
     this.currentUser=user.displayName;
     this.projectService.getManagerProjects(this.currentUser)
       .subscribe((projects)=>{
       // projects with manager as myself
        projects.forEach((project,i)=>{
          this.tasks=[]; 
          this.tasks.push(project.tasks);//[tasks-project1,tasks-project2]
          this.tasks.forEach((task)=>{
            let taskKeys=Object.keys(task);
            taskKeys.forEach((element,j) => {
            this.formatTasks(task[Object.keys(task)[j]],i); 
            });
         })//finaltasks=[task1,task2]
         this.projectNames.push(project.project_name);
        })
        this.groups = new vis.DataSet();
        for (let g=0; g<this.projectNames.length;g++) {
          this.groups.add({id: g, content:this.projectNames[g]});
        }
       })
   })
  let projects$=this.projectService.getManagerProjects(this.currentUser)
}
  ngOnInit() { 
  this.finaltasks=[];
  this.managerTasks();
  this.renderTimeline();
  }
}
