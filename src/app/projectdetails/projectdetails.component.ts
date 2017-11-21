import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Task } from './task';
import { ProjectService } from '../home/project.service';
import { UserService } from '../home/user.service';
import { TasksTimelineComponent } from '../tasks-timeline/tasks-timeline.component';
import { ManagerService } from '../home/manager.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {
  due_date_string: string;
  course: any;
  loggedInName: string;
  url: any;
  user_short_before: string;
  loggedInUser: string;
  @ViewChild(TasksTimelineComponent) timelineCmp: TasksTimelineComponent;
  project_name: any;
  projectID: any;
  taskref: any;
  user_key: string;
  projectStatus: string;
  dateInvalid: boolean = false;
  isManager: string;
  query_id: any;
  timelineToShow: any;
  projectId: number;
  database: any;
  projectToShow;
  sub: any;
  id: any;
  inputsForm: FormGroup;
  taskListObs: FirebaseListObservable<any[]>;
  userList: FirebaseListObservable<any[]>;
  taskList: any[] = [];
  userArray = [];
  currentDate:Date;
  tags = [];
  constructor(
    private location: Location,
    private projectService:ProjectService,
    private userService:UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private managerService:ManagerService
  ) {

    this.isManager = "false";

  }
  //modelling inputs
  categoryType: string;
  assigned_to:{name:"",key:""}
  taskObj = {
    taskName: "",
    categoryType: "",
    assigned_to: "",
    startDate: new Date(),
    dueDate: new Date(),
    details: "",
    hours: 0,
    status: false,
    user_short:"",
  }
  
  clean() {
    this.categoryType=null;
    this.taskObj = {
      taskName: "",
      categoryType: null,
      assigned_to: "",
      startDate: null,
      dueDate: null,
      details: "",
      hours: 0,
      status: false,
      user_short:""
    }
  }
  categoryArray: Array<Object> = [
    { num: 0, name: "Task" },
    { num: 1, name: "Milestone" }
  ];
  setColor(date:string, complete:boolean){
    if(complete){
      return -1;
    }
  let dueDate=new Date(date)
  let currentDate= new Date()
  if(dueDate.getMonth()-currentDate.getMonth()>0){
    if(dueDate.getDate()-currentDate.getDate()<0 && complete==false){
      return 9999;
    }
  }
  if(dueDate.getDate()-currentDate.getDate()<0 && complete==false){
    return 1000;
  }
  else if(dueDate.getDate()-currentDate.getDate()<=2 && dueDate.getDate()-currentDate.getDate()>=0){
    return 1
  }
  else if(currentDate.getDate()-dueDate.getDate()>0 && complete==true){
    return -1;
  }
  else if(dueDate.getDate()-currentDate.getDate()<0 && complete==true){
    return 9999;
  }
  }
  toNumber() {
    this.taskObj.categoryType = this.categoryType
  }
  toNumberUsers() {
    
    this.projectService.getImage(this.assigned_to.key)
      .subscribe((url)=>{
       console.log(url)
        this.url=url  
        this.taskObj.assigned_to = this.assigned_to.name;
        this.taskObj.user_short = this.assigned_to.key;
      })
    

  }
  timeline_key: "";
  onComplete(bool) {
   this.projectService.updateProjectStatus(this.projectID,bool);
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.projectID = params['id'];
      this.user_key=params['user'];
      let routeparams = params['manager'];
      if (routeparams === 'aabsvchfo134852f') {
        this.isManager = "true";
      }
      else {
        this.isManager = "false"
      }
    });
    this.managerService.loggedInUser()
      .subscribe(user=>{
        this.loggedInUser=user.email;
        this.loggedInName=user.displayName;
        let $pos =  this.loggedInUser.indexOf('@');
        this.loggedInUser= this.loggedInUser.substr(0, $pos);
        this.loggedInUser= this.loggedInUser.charAt(0).toUpperCase()+ this.loggedInUser.charAt(1).toUpperCase() +  this.loggedInUser.slice(2);
      });
    
      
    let timelineInfo= this.projectService.getTimelineInfo(this.projectID);
    timelineInfo.subscribe((info)=>{
      this.project_name=info.project_name;
      this.course=info.course;
    })
    this.userList=this.userService.getProjectUsers(this.projectID);
    let projectTasksObs=this.projectService.getTimeline(this.projectID);

    projectTasksObs.subscribe(tasks=>{
      this.taskList=tasks;
      this.globalTasks = tasks;
      this.custom(this.globalTasks)
    })
    this.inputsForm = this.fb.group({
      taskName: [this.taskObj.taskName],
      categoryType: [this.taskObj.categoryType],
      assigned_to: [this.taskObj.assigned_to],
      startDate: [this.taskObj.startDate],
      dueDate: [this.taskObj.dueDate],
      details: [this.taskObj.details],
      hours: [this.taskObj.hours],
      status: [this.taskObj.status],
      tags:[this.tags]
    })
    if (!this.taskObj.status) {
      this.projectStatus = "In Progress";
    }
    else if (this.taskObj.status) {
      this.projectStatus = "Completed";
    }
    this.authService.user.subscribe((val => { this.routeThis(val) }));
  this.currentDate=new Date();
  }
  // tagUser(){
  //   this.projectService.tagUser(this.projectID,this.taskId,this.assigned_to.short_name,this.taskObj.taskName,this.taskObj.dueDate,this.loggedInUser,false);
  // }
  routeThis(val) {
    if (!val)
      this.router.navigate([""])
  }
  preDate(n){
    let current = new Date()
    console.log(this.tags)
    this.taskObj.dueDate=new Date(current.getTime() + n*24*60*60*1000 );
    this.due_date_string = String(`${this.taskObj.dueDate.getMonth() + 1}-${this.taskObj.dueDate.getDay()}-${this.taskObj.dueDate.getFullYear()}`)
  
  }
  checkDate() {
    if (new Date(this.taskObj.dueDate).getTime() - new Date(this.taskObj.startDate).getTime() < 0) {
      this.dateInvalid = true;
    }
    else {
      this.dateInvalid = false;
    }
  }
  //end
  taskCategory = [];
  MilestoneCategory = [];
  globalTasks = [];
  filterTaskCategory() {
    this.taskList = this.globalTasks.filter((task) => {
      return task.categoryType === "Task";
    });
    this.timelineCmp.filterTaskCategory();
  }
  filterMilestoneCategory() {
    this.taskList = this.globalTasks.filter((task) => {
      return task.categoryType === "Milestone";
    });
    this.timelineCmp.filterMilestoneCategory();
  }
  showAll() {
    this.taskList = this.globalTasks;
    this.timelineCmp.showAll();
  }
  custom(array: any) {
    let userArray;
    this.userList.subscribe((users)=>{
      userArray=users;
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j <userArray.length; j++) {
          if (this.taskList[i].assigned_to === userArray[j].user_name) {
            this.taskList[i].assigned_to = userArray[j].user_name
            this.taskList[i].imageUrl = userArray[j].imageUrl;
          }
        }
      }
    })
 
  }
  //true is latest dates at top/ false is latest dates at bottom
  sortUp: boolean = false;
  sortTasks() {
    this.sortUp = !this.sortUp;
    if (this.sortUp){
      this.taskList = this.taskList.sort((a, b) => {
        return -new Date(a.dueDate).getTime() + new Date(b.dueDate).getTime();
      });
    }
    else if (!this.sortUp) {
      this.taskList = this.taskList.sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
    }
  }
  addTask() {
    
        this.edit = false;
        let task_key= this.projectService.addTasks({
          taskName: this.taskObj.taskName,
          categoryType: this.taskObj.categoryType,
          assigned_to: this.taskObj.assigned_to,
          startDate: this.taskObj.startDate,
          dueDate: this.taskObj.dueDate,
          details: this.taskObj.details,
          hours: this.taskObj.hours,
          status: false,
          user_short:this.assigned_to.key,
          comments:{},
          imageUrl:this.url.$value,tags:this.tags
        });
        this.projectService.addTaskNotif(this.assigned_to.key,this.loggedInName,this.projectID,task_key,this.taskObj.taskName,this.taskObj.dueDate)
        // this.projectService.tagUser(this.projectID,task_key,this.assigned_to,this.taskObj.taskName,this.taskObj.dueDate,this.loggedInUser,true);
        this.projectService.addTasksForMe(this.assigned_to.key,this.projectID,this.project_name,task_key,this.taskObj.dueDate,this.taskObj.taskName,this.taskObj.categoryType)
        this.inputsForm.reset();
        this.sortUp = true;
        this.timelineCmp.destroy();
        this.timelineCmp.getTasks();
        this.timelineCmp.drawTimeline();
      }
  resetForm() {
    this.taskObj={
      taskName: "",
      categoryType: "",
      assigned_to: "",
      startDate: new Date(),
      dueDate: new Date(),
      details: "",
      hours: 0,
      status: false,
      user_short:""
    }
   
  }
  taskId: any;
  edit: boolean = false;
  getTask(taskKey){
    this.edit = true;
    this.taskId = taskKey;
    let taskToget;
    let taskToGetObs = this.projectService.getTask(taskKey,this.projectID);
    taskToGetObs.subscribe((task) => {
      this.assigned_to={name:"",key:""};
      console.log(task)
      this.taskObj=task;
      this.taskObj.user_short=task.user_short;
      this.categoryType = task.categoryType;
      this.assigned_to.key=task.user_short;
      this.assigned_to.name=task.assigned_to;
      this.user_short_before= task.user_short;
    })
    console.log(this.assigned_to)
  }
  editTask() {
    
        this.projectService.editTasksForMe( 
          this.user_short_before,
          this.assigned_to.key,
          this.projectID,
          this.taskId,
          this.taskObj.dueDate,
          this.taskObj.taskName,
          this.taskObj.categoryType);
        this.projectService.editTask({
          taskName: this.taskObj.taskName,
          categoryType: this.taskObj.categoryType,
          assigned_to: this.taskObj.assigned_to,
          startDate: this.taskObj.startDate,
          dueDate: this.taskObj.dueDate,
          details: this.taskObj.details,
          hours: this.taskObj.hours,
          status: this.taskObj.status,
          imageUrl:this.url.$value,
          user_short:this.assigned_to.key,
          tags:this.tags
        });
    
        this.projectService.editNotification({
          due_date:this.taskObj.dueDate,manager:this.loggedInUser,project_id:this.projectID,task_id:this.taskId,task_name:this.taskObj.taskName
          },this.taskObj.user_short,this.taskId)
        this.sortUp = true;
        this.timelineCmp.destroy();
        this.timelineCmp.getTasks();
        this.timelineCmp.drawTimeline();
      }
  deleteTask(){
    this.projectService.deleteTasksForMe(this.taskObj.user_short,this.taskId,this.projectID);
    this.projectService.deleteTask( this.taskObj.user_short);
    this.sortUp = true;
    this.timelineCmp.destroy();
    this.timelineCmp.getTasks();
    this.timelineCmp.drawTimeline();
  }
  userTasks(){
    this.taskList = this.globalTasks.filter((task) => {
      return task.user_short === this.loggedInUser;
    });
    this.timelineCmp.filterMyTaskCategory(this.loggedInUser);
  }
}