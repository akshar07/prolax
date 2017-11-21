import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../home/project.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {
  lessons: any;
  allProject: any[];
  projectLearnings: any;
  searchCourse:string;
  constructor(private projectService:ProjectService,
              public authService: AuthService,
              private router:Router,) { }
  searchLessons(){

   this.projectService.getLearningProjects(this.searchCourse)
     .subscribe((lesson)=>{
       console.log(lesson)
       this.lessons=lesson;
     })
    
  }
  routeThis(val){
    if(!val){
    this.router.navigate([""]);
  }
}
  ngOnInit() {
    this.authService.user.subscribe((val=>{this.routeThis(val)}))
  }
  
}
