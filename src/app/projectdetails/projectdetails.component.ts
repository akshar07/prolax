import { Component, OnInit, Input } from '@angular/core';
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

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {
  projectManager: any;
  project_name: any;
  projectClient: any;
  project_number: any;
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
  constructor(
    private location: Location,
    private projectService:ProjectService,
    private userService:UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
  ) {

    this.isManager = "false";

  }
  //modelling inputs
  categoryType: string;
  assigned_to = { user_name: "", imageUrl: "", user_key: { $key: "", imageUrl: "" } }
  taskObj = {
    taskName: "",
    categoryType: "",
    assigned_to: "",
    startDate: new Date(),
    dueDate: new Date(),
    details: "",
    hours: 0,
    status: false,
    imageUrl: this.assigned_to.imageUrl,
   
  }
  clean() {
    this.inputsForm.reset();
  }
  categoryArray: Array<Object> = [
    { num: 0, name: "Task" },
    { num: 1, name: "Milestone" }
  ];

  setColor(date:string, complete:boolean){

  let t=new Date(date).getDate();
  let d= new Date().getDate();
  if(t-d<0 && complete==false){
    return 1000;
  }
  else if(t-d<0 && complete==true){
    return 9999;
  }
  return t-d;
  }
  toNumber() {
    this.taskObj.categoryType = this.categoryType
  }
  toNumberUsers() {

    this.taskObj.assigned_to = this.assigned_to.user_key.$key;
    this.taskObj.imageUrl = this.assigned_to.user_key.imageUrl;
    console.log( this.taskObj)
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
    let timelineInfo= this.projectService.getTimelineInfo(this.projectID);
    timelineInfo.subscribe((info)=>{
      this.project_number=info.project_number;
      this.projectClient=info.client;
      this.project_name=info.project_name;
      this.projectManager=info.manager;
    })
    let projectTasksObs=this.projectService.getTimeline(this.projectID);
    projectTasksObs.subscribe(tasks=>{
      this.taskList=tasks;
      this.globalTasks = tasks;
      // this.sortTasks();
      // this.custom(this.taskList)
    })
    this.inputsForm = this.fb.group({
      taskName: [this.taskObj.taskName],
      categoryType: [this.taskObj.categoryType],
      assigned_to: [this.taskObj.assigned_to],
      startDate: [this.taskObj.startDate],
      dueDate: [this.taskObj.dueDate],
      details: [this.taskObj.details],
      hours: [this.taskObj.hours],
      status: [this.taskObj.status]
    })
    if (!this.taskObj.status) {
      this.projectStatus = "In Progress";
    }
    else if (this.taskObj.status) {
      this.projectStatus = "Completed";
    }
    this.authService.user.subscribe((val => { this.routeThis(val) }));
    this.userList=this.userService.getUsers();
  }
  routeThis(val) {
    if (!val)
      this.router.navigate([""])
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
    })
  }
  filterMilestoneCategory() {
    this.taskList = this.globalTasks.filter((task) => {
      return task.categoryType === "Milestone";
    })
  }
  showAll() {
    this.taskList = this.globalTasks;
  }
  // custom(array: any) {

  //   for (let i = 0; i < array.length; i++) {
  //     for (let j = 0; j < this.userArray.length; j++) {

  //       if (this.taskList[i].assigned_to === this.userArray[0][j].$key) {
  //         this.taskList[i].assigned_to = this.userArray[0][j].user_name;
  //         this.taskList[i].imageUrl = this.userArray[0][j].imageUrl;

  //       }
  //       else {

  //       }

  //     }
  //   }
  // }
  //true is latest dates at top/ false is latest dates at bottom
  sortUp: boolean = false;
  // sortTasks() {
  //   this.sortUp = !this.sortUp;
  //   if (this.sortUp){
  //     this.taskList = this.taskList.sort((a, b) => {
  //       return -new Date(a.dueDate).getTime() + new Date(b.dueDate).getTime();
  //     });
  //   }
  //   else if (!this.sortUp) {
  //     this.taskList = this.taskList.sort((a, b) => {
  //       return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  //     })
  //   }
  // }
  addTask() {
    this.edit = false;
    console.log(this.taskObj)
    this.projectService.addTasks({
      taskName: this.taskObj.taskName,
      categoryType: this.taskObj.categoryType,
      assigned_to: this.taskObj.assigned_to,
      startDate: this.taskObj.startDate,
      dueDate: this.taskObj.dueDate,
      details: this.taskObj.details,
      hours: this.taskObj.hours,
      status: false,
      imageUrl: this.taskObj.imageUrl,
      qc1:{},
      qc2:{}
    })
    this.inputsForm.reset();
    this.sortUp = true;
    // this.sortTasks();
  }
  resetForm() {
    this.inputsForm.reset();
  }
  taskId: any;
  edit: boolean = false;
  getTask(taskKey){
    this.edit = true;
    this.taskId = taskKey;
    let taskToget;
    let taskToGetObs = this.projectService.getTask(taskKey,this.projectID);
    taskToGetObs.subscribe((task) => {
      this.categoryType = task.categoryType;
      this.assigned_to.user_name = task.assigned_to;
      this.taskObj = task;
      console.log(this.taskObj)
    })
  
  }
  editTask() {
    this.projectService.editTask({
      taskName: this.taskObj.taskName,
      categoryType: this.taskObj.categoryType,
      assigned_to: this.taskObj.assigned_to,
      startDate: this.taskObj.startDate,
      dueDate: this.taskObj.dueDate,
      details: this.taskObj.details,
      hours: this.taskObj.hours,
      status: this.taskObj.status,
      imageUrl: this.taskObj.imageUrl,
    })
    this.sortUp = true;
  }
  deleteTask() {
    this.projectService.deleteTask();
    this.sortUp = true;
 
  }
  userTasks(){
    this.taskList = this.globalTasks.filter((task) => {
      console.log(task)
      return task.assigned_to === this.user_key;
    })
  }
}