import { Component, OnInit, Input } from '@angular/core';
import { NgModule, ElementRef} from '@angular/core'
import { ProjectService } from '../home/project.service';
declare var vis: any;

@Component({
  selector: 'app-tasks-timeline',
  templateUrl: './tasks-timeline.component.html',
  styleUrls: ['./tasks-timeline.component.css']
})
export class TasksTimelineComponent implements OnInit {
  load: boolean;
  allTasks: any[];
  userTasks: any[] = [];
  tasks: any[];
  @Input()
  timelineId;
  @Input()
  loggedInUser;
  timeline: any;
  options: any;
  items: any;

  constructor(private projectService:ProjectService,private element: ElementRef) { }
  render(){  
    this.items = new vis.DataSet(this.userTasks);
    this.options = {start:new Date()};  
    this.timeline = new vis.Timeline(this.element.nativeElement, this.items,this.options);
      // Create a Timeline
      let startDate=new Date();
      let endDate= startDate.setDate(startDate.getDate()+8*24*60*60*1000);
    // this.items.push()

    }
    destroy(){
      this.timeline.destroy();
   }
   drawTimeline(){
    this.load=true;
    setTimeout(()=>{this.render();this.load=false;},1500);
   }
   quickRender(){
     this.render()
   }
   getTasks(){
    this.userTasks=[];
    this.projectService.getTimeline(this.timelineId)
    .subscribe((task)=>{
      this.tasks=task;
      this.allTasks=task;
      this.formatTasks(this.tasks);
    });
   
   }
   formatTasks(tasks){
      tasks.forEach((task,i)=>{
      this.userTasks.push({
         content:task.taskName,
         start:task.dueDate,
         className:task.categoryType
       })
       })
   }
   filterTaskCategory() {
    this.tasks = this.allTasks.filter((task) => {
      return task.categoryType === "Task";
    });
    this.userTasks=[];
    this.formatTasks( this.tasks);
    this.destroy();
    this.quickRender();
  }
  showAll() {
    this.tasks = this.allTasks;
    this.userTasks=[];
    this.formatTasks( this.tasks);
    this.destroy();
    this.quickRender();
  }
  filterMilestoneCategory() {
    this.tasks = this.allTasks.filter((task) => {
      return task.categoryType === "Milestone";
    });
    this.userTasks=[];
    this.formatTasks( this.tasks);
    this.destroy();
    this.quickRender();
  }
  filterMyTaskCategory(user){
    this.tasks = this.allTasks.filter((task) => {
      return task.user_short === user;
    });
    this.userTasks=[];
    this.formatTasks( this.tasks);
    this.destroy();
    this.quickRender();
  }
  ngOnInit() {
    this.getTasks();
    this.drawTimeline();
  }

}
