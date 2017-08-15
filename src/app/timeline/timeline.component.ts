import { Component, OnInit, Input } from '@angular/core';
import { NgModule, ElementRef} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/Rx'

import { Project } from '../home/project';
import { AngularFireDatabase } from 'angularfire2/database';
declare var vis: any;


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
@Input()
  Key:string;
  database: AngularFireDatabase;
  projectsTimeline: any=[];
  projectsName: any;
  groups: any;
  timeline: any;
  name:string;
  constructor(private element: ElementRef,db: AngularFireDatabase,) {
  this.database=db;
  }
    taskA=[];
    items=new vis.DataSet([]);
    options:any;
  render(){  
  this.items = new vis.DataSet(this.projectsTimeline);
  this.options = {start:new Date()};  
  this.timeline = new vis.Timeline(this.element.nativeElement, this.items,this.groups ,this.options);
    // Create a Timeline
    let startDate=new Date();
    let endDate= startDate.setDate(startDate.getDate()+8*24*60*60*1000);
  this.items.push()
  }
destroy(){
   this.timeline.destroy();
}
getCloseout(projects:Array<Project>){
  this.items=[];
  this.projectsTimeline=[];
  this.projectsName=[];
  let filteredProjects=projects.filter((project)=>{
    let ukey="";
    let isUserproject:boolean=false;
    let tempKey=this.Key
    Object.keys(project.assigned_to).forEach(function(key,index) {
     
      ukey=project.assigned_to[key].assigned_to;
      console.log(ukey)
        if(tempKey===ukey){
          isUserproject=true;
    
        }
    })
     return isUserproject;
  })
  filteredProjects.forEach((project,i)=>{
  let tasksA=[];
  let userTasks=[];
  let tasks= this.database.list(`/projecttimeline/${project.timeline_key}/tasks`);
  tasks.subscribe(task=>{
      task.forEach((item)=>{
        tasksA.push(item);
      
        userTasks=tasksA;
      });  
  userTasks.forEach((task)=>{
    this.projectsTimeline.push({
      content:task.taskName,
      start:task.dueDate,
      group:i,
    })
    })
      tasksA=[];
  })
  this.projectsName.push(project.title);
  console.log(this.projectsName)
  })
this.groups = new vis.DataSet();
  for (let g=0; g<this.projectsName.length;g++) {
    this.groups.add({id: g, content:this.projectsName[g]});
  }
 console.log(this.projectsTimeline)
  setTimeout(()=>this.render(),500)
}
  ngOnInit() { 
 this.items = this.database.list('/projects').take(1).toPromise()
             .then((res)=>{this.getCloseout(res)},err=>alert(err))
  }
}
