import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ProjectService } from '../home/project.service';

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
timelineId:string;
@Input()
isManager:string;

database:any;
  constructor(private fb:FormBuilder, private projectService:ProjectService ) { 
  }
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
    this.projectService.getQC2(this.timelineId,this.taskId)
    .subscribe((QCObject)=>{
      if(QCObject[Object.keys(QCObject)[0]]==null){
        this.QCObject=this.QCObject;
      }
      else{
        this.QCObject=QCObject;
      }
     })
  }
  QCId:string;
  submitQC2(){
    this.projectService.addQC2(this.timelineId,this.taskId,{
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
  qcArray:Array<any>=[];
  editQC2(){
    this.projectService.editqC2(this.taskId,this.timelineId,{
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
