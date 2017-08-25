import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../home/project.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {
  allProject: any[];
  projectLearnings: any;

  constructor(private projectService:ProjectService,
              public authService: AuthService,
              private router:Router,) { }
  category:string='no selection';
  projectCategory=["no selection","Energy Modeling",
  "CFD",
  "Daylighting",
  "LEED consulting",
  "Compliance modeling",
  "Hygrothermal analysis",
  "Heat Transfer analysis",
  "Envelop Consulting",
  "Sustainability Strategies"];
  areas=[{text:"no selection" ,val:0},{text:"area < 100000" ,val:1},{text:"100000 < area < 1 million" ,val:2},{text:"area > 1 million" ,val:3}];
  market_sector=["no selection","Aviation",
  "Commercial",
  "Cultural/Institutional",
  "Education K-12",
  "Government",
  "Healthcare",
  "Higher Education",
  "Hospitality/Gaming",
  "Mission Critical",
  "Sports",
  "Transportation"];
  selectedSector:string='no selection';
  selectedArea:number=0;
  filter(){
    if( this.category==='no selection' &&  this.selectedSector==='no selection' && this.selectedArea==0 ||
    this.selectedArea==null ||this.category===null|| this.selectedSector===null){
 
      this.projectLearnings=[];
    }
    else{
      this.projectLearnings=this.allProject.filter(projects=>{
        if(this.category==null || this.category==='no selection'){
          return true
        }
        else{
          return projects.category===this.category;
        }
      }).filter(projects=>{
        if(this.selectedSector==null || this.selectedSector==='no selection'){
          return true;
        }
        else{
          return projects.market_sector===this.selectedSector;
        }
      }).filter(projects=>{
        if( this.selectedArea==0 || this.selectedArea==null){

          return true;
        }
       else if(this.selectedArea==1){
            return projects.area<=100000;
        }
       else if(this.selectedArea==2){
        return projects.area>=100000 && projects.area<=1000000;
        }
        else if(this.selectedArea==3){
          return projects.area>=1000000;
          }
      })
    }
 
  }

  routeThis(val){
    if(!val){
    this.router.navigate([""]);
  }
}
  ngOnInit() {
    this.authService.user.subscribe((val=>{this.routeThis(val)}))
    this.projectService.getLearningProjects()
      .subscribe(projects=>{this.allProject=projects;})
  }
  
}
