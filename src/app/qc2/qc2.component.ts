import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-qc2',
  templateUrl: './qc2.component.html',
  styleUrls: ['./qc2.component.css']
})
export class Qc2Component implements OnInit {
  qc: string;
@Input()
taskId:string;

@Input()
isManager:string;

taskQC1Observable: FirebaseListObservable<any[]>;
database:any;
  constructor(private fb:FormBuilder, private db: AngularFireDatabase) { 
      this.database=db;
  }
  QCObservableObject:FirebaseListObservable<any[]>;
  taskArray:any;

QCObject={

crossCheck:false,bibliographical:false,automaticLookup:false,
protection:false,automatedChecks:false,unitLabels:false,
unitsCarried:false,conversion:false,identifyParameters:false,

aggregated:false,

transcribed:false,documentation:false,supportingData:false,
archive:false,consistency:false,methodological:false,mitigation:false,performance:false,
subcategories:false,benchmarked:false,unusual:false,add:true
}
inputsForm:FormGroup;
  ngOnInit() {
    this.inputsForm=this.fb.group({
      crossCheck:this.QCObject.crossCheck,
      bibliographical:this.QCObject.bibliographical,
      automaticLookup:[this.QCObject.automaticLookup],
      protection:[this.QCObject.protection],
      automatedChecks:this.QCObject.automatedChecks,
      unitLabels:this.QCObject.unitLabels,
      unitsCarried:this.QCObject.unitsCarried,
      conversion:this.QCObject.conversion,
      identifyParameters:this.QCObject.identifyParameters,
      aggregated:this.QCObject.aggregated,
      transcribed:this.QCObject.transcribed,
      documentation:this.QCObject.documentation,
      supportingData:this.QCObject.supportingData,
      archive:this.QCObject.archive,
      consistency:this.QCObject.consistency,
      methodological:this.QCObject.methodological,
      mitigation:this.QCObject.mitigation,
      performance:this.QCObject.performance,
      subcategories:this.QCObject.subcategories,
      benchmarked:this.QCObject.benchmarked,
      unusual:this.QCObject.unusual,
    });
    this.taskQC1Observable=this.database.list(`${this.taskId}/qc2`);
        this.taskQC1Observable.subscribe((task)=>{
          this.taskArray=task;
        });
  this.QCObservableObject=this.database.object(`${this.taskId}/qc2`);
        this.QCObservableObject.subscribe((i)=>{
     
          this.qc= Object.keys(i)[0]
     
          if(i[Object.keys(i)[0]]){
              this.QCObject=i[Object.keys(i)[0]];
          }
            else{
              this.QCObject=this.QCObject;
            }
        })
  }
  QCId:string;
submitQC2(){
  this.taskQC1Observable.push({
    crossCheck:this.QCObject.crossCheck,
      bibliographical:this.QCObject.bibliographical,
      automaticLookup:[this.QCObject.automaticLookup],
      protection:[this.QCObject.protection],
      automatedChecks:this.QCObject.automatedChecks,
      unitLabels:this.QCObject.unitLabels,
      unitsCarried:this.QCObject.unitsCarried,
      conversion:this.QCObject.conversion,
      identifyParameters:this.QCObject.identifyParameters,
      aggregated:this.QCObject.aggregated,
      transcribed:this.QCObject.transcribed,
      documentation:this.QCObject.documentation,
      supportingData:this.QCObject.supportingData,
      archive:this.QCObject.archive,
      consistency:this.QCObject.consistency,
      methodological:this.QCObject.methodological,
      mitigation:this.QCObject.mitigation,
      performance:this.QCObject.performance,
      subcategories:this.QCObject.subcategories,
      benchmarked:this.QCObject.benchmarked,
      unusual:this.QCObject.unusual,
      add:false
  }).then((a)=>{
    let key=a.getKey();
      this.QCId=key;
      this.getTask(this.QCId);
  });
}
qcArray:Array<any>=[];
getTask(key){
  this.QCObservableObject=this.database.object(`${this.taskId}/qc2/${this.QCId}`);
  this.QCObservableObject.subscribe((a)=>{ 
    this.qcArray.push(a);
    this.QCObject=this.qcArray[0] 
  })
}
editQC2(){
 let QCEditObs;

 QCEditObs=this.database.object(`${this.taskId}/qc2/${this.qc}`);

 QCEditObs.update({
   crossCheck:this.QCObject.crossCheck,
      bibliographical:this.QCObject.bibliographical,
      automaticLookup:[this.QCObject.automaticLookup],
      protection:[this.QCObject.protection],
      automatedChecks:this.QCObject.automatedChecks,
      unitLabels:this.QCObject.unitLabels,
      unitsCarried:this.QCObject.unitsCarried,
      conversion:this.QCObject.conversion,
      identifyParameters:this.QCObject.identifyParameters,
      aggregated:this.QCObject.aggregated,
      transcribed:this.QCObject.transcribed,
      documentation:this.QCObject.documentation,
      supportingData:this.QCObject.supportingData,
      archive:this.QCObject.archive,
      consistency:this.QCObject.consistency,
      methodological:this.QCObject.methodological,
      mitigation:this.QCObject.mitigation,
      performance:this.QCObject.performance,
      subcategories:this.QCObject.subcategories,
      benchmarked:this.QCObject.benchmarked,
      unusual:this.QCObject.unusual,
      add:false
 })
 
}
}
