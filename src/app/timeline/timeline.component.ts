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
  currentUser: string;
  userTasks: any[];
  @Input()
  Key:string;
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
  this.items = new vis.DataSet(this.userTasks);
  this.options = {start:new Date()};  
  this.timeline = new vis.Timeline(this.element.nativeElement, this.items,this.groups ,this.options);
    // Create a Timeline
    let startDate=new Date();
    let endDate= startDate.setDate(startDate.getDate()+8*24*60*60*1000);
  }
destroy(){
   this.timeline.destroy();
}

// managerTasks(){
//   this.managerService.loggedInUser()
//   .subscribe((user)=>{
//      this.currentUser=user.email;
//      let $pos =  this.currentUser.indexOf('@');
//      this.currentUser = this.currentUser.substr(0, $pos);
//      this.currentUser= this.currentUser.charAt(0).toUpperCase()+ this.currentUser.charAt(1).toUpperCase() + this.currentUser.slice(2);
//      this.projectService.getManagerTasks(this.currentUser)
//      .subscribe((userTasks)=>{
//        this.userTasks=userTasks;
//        console.log(this.userTasks)
//      })
//    })
//   setTimeout(()=>this.render(),1000);
// }
  ngOnInit() { 
   this.managerService.loggedInUser()
     .subscribe((user)=>{
        this.currentUser=user.email;
        let $pos =  this.currentUser.indexOf('@');
        this.currentUser = this.currentUser.substr(0, $pos);
        this.currentUser= this.currentUser.charAt(0).toUpperCase()+ this.currentUser.charAt(1).toUpperCase() + this.currentUser.slice(2);
        this.projectService.getUserTasks(this.currentUser)
        .subscribe((userTasks)=>{
          this.userTasks=userTasks;
          console.log(this.userTasks)
        })
      })
     setTimeout(()=>this.render(),1000);
     
    //  this.managerTasks()
  }
}
