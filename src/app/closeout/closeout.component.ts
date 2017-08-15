import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
@Component({
  selector: 'app-closeout',
  templateUrl: './closeout.component.html',
  styleUrls: ['./closeout.component.css']
})
export class CloseoutComponent implements OnInit {
  @Output() onComplete = new EventEmitter<boolean>();
  @Input()
  isManager:string;
  @Input()
projectId:string;

database: AngularFireDatabase;
inputsForm:FormGroup;
projectListObservable: FirebaseListObservable<any[]>;
projectObjectObservable:FirebaseObjectObservable<any[]>;
  projectArray: any[];

  constructor(private fb:FormBuilder, private db: AngularFireDatabase) { 
    this.database=db;
  }
  closeOut:{
    projectBackground:string,
    contract:string,
    Information:string,
    Issues:string,
    Performance:string,
    Scope:string,
    Lessons:string,
    Business:string,
    PR:string,
    add:boolean
  }
   close(bool) {
    this.onComplete.emit(bool);
  }
  ngOnInit() {

    this.closeOut={
        projectBackground:"",
        contract:"",
        Information:"",
        Issues:"",
        Performance:"",
        Scope:"",
        Lessons:"",
        Business:"",
        PR:"",
        add:true
    }
 this.inputsForm=this.fb.group({
   projectBackground:this.closeOut.projectBackground,
   contract:this.closeOut.contract,
   Information:this.closeOut.Information,
   Issues:this.closeOut.Issues,
   Performance:this.closeOut.Performance,
   Scope:this.closeOut.Scope,
   Lessons:this.closeOut.Lessons,
   Business:this.closeOut.Business,
  PR:this.closeOut.PR,
  add:true
 })


 //get data
     this.projectListObservable=this.database.list(`${this.projectId}/closeout`);
        this.projectListObservable.subscribe((project)=>{
          this.projectArray=project;
        });
//assign initial data
 this.projectObjectObservable=this.database.object(`${this.projectId}/closeout`);
        this.projectObjectObservable.subscribe((i)=>{
         
      
        this.key= Object.keys(i)[0]
          if(i[Object.keys(i)[0]]){
              this.closeOut=i[Object.keys(i)[0]];
          }
            else{
              this.closeOut=this.closeOut;
            }
         
        })
  }
key="";
submitProjectCloseout(bool){

  this.projectListObservable.push({
  projectBackground:this.closeOut.projectBackground,
   contract:this.closeOut.contract,
   Information:this.closeOut.Information,
   Issues:this.closeOut.Issues,
   Performance:this.closeOut.Performance,
   Scope:this.closeOut.Scope,
   Lessons:this.closeOut.Lessons,
   Business:this.closeOut.Business,
  PR:this.closeOut.PR,
  add:false
  });
this.close(bool);
}
reOpen(bool){
  this.close(bool);
}
editProjectCloseout(){
 let CloseEditObs;

 CloseEditObs=this.database.object(`${this.projectId}/closeout/${this.key}`);
  
  CloseEditObs.update({
  projectBackground:this.closeOut.projectBackground,
   contract:this.closeOut.contract,
   Information:this.closeOut.Information,
   Issues:this.closeOut.Issues,
   Performance:this.closeOut.Performance,
   Scope:this.closeOut.Scope,
   Lessons:this.closeOut.Lessons,
   Business:this.closeOut.Business,
  PR:this.closeOut.PR,
  add:false
  })
}
}
