import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ProjectService } from '../home/project.service';
declare var vis: any;
@Component({
  selector: 'app-usertimeline',
  templateUrl: './usertimeline.component.html',
  styleUrls: ['./usertimeline.component.css']
})
export class UsertimelineComponent implements OnInit {
  load: boolean;
  projectname = [];
  @Input()
user:string;
  constructor(private projectService:ProjectService,private element: ElementRef) { }
  items=new vis.DataSet([]);
  options:any;
  groups: any;
  timeline: any;
  render(){  
    this.items = new vis.DataSet(this.userTasks);
    this.options = {start:new Date()};  
    this.timeline = new vis.Timeline(this.element.nativeElement, this.items,this.groups ,this.options);
    let startDate=new Date();
    let endDate= startDate.setDate(startDate.getDate()+8*24*60*60*1000);
  }
destroy(){
   this.timeline.destroy();
}
  getuserTasks(){
    this.projectService.getMyTasks(this.user)
      .subscribe((projects)=>{
   
        console.log(projects)
        this.projectname=[];
        let taskKeys=[];
        projects.forEach((project,i)=>{
         
          let keys;
          if(Object.keys(project).includes('tasks')){
            keys=Object.keys(project['tasks']);
           taskKeys=[...keys];
           this.projectname=[...this.projectname,...project.project_name]// get project names
          }
          taskKeys.forEach(key=>{
  
            this.formatTask((project['tasks'][key]),i);
            this.groups = new vis.DataSet();
            for (let g=0; g<this.projectname.length;g++) {
  
              this.groups.add({id: g, content:this.projectname[g]});
            }
          })
        });
      })
  }
  userTasks=[];
  formatTask(task,i){
    task['group']=i;
    this.userTasks=[...this.userTasks,task];
    console.log(this.userTasks)
  }
  ngOnInit() {
    this.userTasks=[];
    this.projectname=[];
    this.groups = new vis.DataSet();
    this.getuserTasks();
    this.load=true;
    setTimeout(()=>{this.render();this.load=false;},1000);
  }

}