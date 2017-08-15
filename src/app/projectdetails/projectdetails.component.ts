import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Task } from './task';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {
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
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
  ) {

    this.database = db;
    this.isManager = "false";
    this.userList = this.db.list("/users");
    this.userList.subscribe((user) => {
      this.userArray.push(user);

    })

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
  }
  timeline_key: "";
  onComplete(bool) {
    let projectObj = this.database.object('projects/' + this.id);
    projectObj.update({
      projectStatus: bool

    })

  }
  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      let routeparams = params['manager'];
      if (routeparams === 'aabsvchfo134852f') {
        this.isManager = "true";
      }
      else {
        this.isManager = "false"
      }
    });
    
    this.database.object('projects/' + this.id).subscribe((res) => {
      this.projectToShow = res;
      this.getTimeline(this.projectToShow.timeline_key)
    });
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

    this.authService.user.subscribe((val => { this.routeThis(val) }))

  }
  routeThis(val) {
    if (!val)
      this.router.navigate([""])
  }

  // category
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


  getTimeline(id) {
    this.query_id = id;
    this.database.object('projecttimeline/' + this.query_id).subscribe((res) => {
      this.timelineToShow = res;

      this.timeline_key = this.timelineToShow.$key;
      this.taskListObs = this.database.list(`projecttimeline/${this.timeline_key}/tasks`)
      this.taskListObs.subscribe(res => {
        this.taskList = res;
        this.globalTasks = res;
        this.sortTasks();
        this.custom(this.taskList)
      })
    });

  }
  custom(array: any) {

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < this.userArray[0].length; j++) {

        if (this.taskList[i].assigned_to === this.userArray[0][j].$key) {
          this.taskList[i].assigned_to = this.userArray[0][j].user_name;
          this.taskList[i].imageUrl = this.userArray[0][j].imageUrl;

        }
        else {

        }

      }
    }
  }
  //true is latest dates at top/ false is latest dates at bottom
  sortUp: boolean = false;
  sortTasks() {
    this.sortUp = !this.sortUp;

    if (this.sortUp) {

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
    let projectObj= this.database.list(`projects/${this.id}/assigned_to` );
    let assignedKey = projectObj.push({assigned_to:this.taskObj.assigned_to}).key

    this.edit = false;
    this.taskListObs.push({
      taskName: this.taskObj.taskName,
      categoryType: this.taskObj.categoryType,
      assigned_to: this.taskObj.assigned_to,
      startDate: this.taskObj.startDate,
      dueDate: this.taskObj.dueDate,
      details: this.taskObj.details,
      hours: this.taskObj.hours,
      status: false,
      imageUrl: this.taskObj.imageUrl,
      qaqc: [{ task_name: this.taskObj.taskName }]
    })

    this.inputsForm.reset();
    this.sortUp = true;
    this.sortTasks();
  }
  resetForm() {
    this.inputsForm.reset();
  }
  taskId: any;
  edit: boolean = false;
  getTask(taskKey) {
    this.edit = true;
    this.taskId = taskKey;
    let taskToget;
    let taskToGetObs = this.database.object(`projecttimeline/${this.timeline_key}/tasks/${this.taskId}`);
    taskToGetObs.subscribe((task) => {

      this.categoryType = task.categoryType;
      this.assigned_to.user_name = task.assigned_to;

      this.taskObj = task;
    })
  }
  editTask() {
    let taskToEdit;
    let taskToEditObs = this.database.object(`projecttimeline/${this.timeline_key}/tasks/${this.taskId}`);
    taskToEditObs.subscribe(task => {
      taskToEdit = task;
    });
    taskToEditObs.update({
      taskName: this.taskObj.taskName,
      categoryType: this.taskObj.categoryType,
      assigned_to: this.taskObj.assigned_to,
      startDate: this.taskObj.startDate,
      dueDate: this.taskObj.dueDate,
      details: this.taskObj.details,
      hours: this.taskObj.hours,
      status: this.taskObj.status,
      imageUrl: this.taskObj.imageUrl,
    });
    this.sortUp = true;
    this.sortTasks();
  }
  deleteTask() {

    let taskToDelete;
    let taskToDeleteObs = this.database.object(`projecttimeline/${this.timeline_key}/tasks/${this.taskId}`);
    taskToDeleteObs.subscribe(task => {
      taskToDelete = task;
    });
    taskToDeleteObs.remove();
    this.sortUp = true;
    this.sortTasks();
  }

}