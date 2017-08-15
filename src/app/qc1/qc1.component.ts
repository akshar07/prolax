import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { QC1 } from './qc1';

@Component({
  selector: 'app-qc1',
  templateUrl: './qc1.component.html',
  styleUrls: ['./qc1.component.css']
})
export class Qc1Component implements OnInit {
  QCObject: { coverPage: boolean; tableContents: boolean; executiveSummary: boolean; frontComment: string; matchNumbers: boolean; significantDigits: boolean; updatedFigures: boolean; alignment: boolean; consistentFormatting: boolean; accuracy: boolean; tablesComment: string; referenceConsistency: boolean; referenceComment: string; acronyms: boolean; fonts: boolean; highlighting: boolean; styling: boolean; spell: boolean; generalComment: string; add: boolean; };
@Input()
taskId:string;

@Input()
isManager:string;

taskQC1Observable: FirebaseListObservable<any[]>;


database:any;
inputsForm:FormGroup;
  constructor(private fb:FormBuilder, private db: AngularFireDatabase) { 
      this.database=db;
  }
  QCObservableObject:FirebaseListObservable<any[]>;
  taskArray:any;
  ngOnInit() {

this.QCObject={

// large Form Inputs // Front Section
coverPage:false,tableContents:false,executiveSummary:false,
frontComment:"",

//tables anf figures
matchNumbers:false,significantDigits:false,updatedFigures:false,
alignment:false,consistentFormatting:false,accuracy:false,tablesComment:"",

//reference 
referenceConsistency:false,referenceComment:"",

//general format
acronyms:false,fonts:false,highlighting:false,
styling:false,spell:false, generalComment:"",
add:true
}

    this.inputsForm=this.fb.group({
      coverPage:[this.QCObject.coverPage],
      tableContents:[this.QCObject.tableContents],
      executiveSummary:[this.QCObject.executiveSummary],
      frontComment:[this.QCObject.frontComment],
      matchNumbers:this.QCObject.matchNumbers,
      significantDigits:this.QCObject.significantDigits,
      updatedFigures:this.QCObject.updatedFigures,
      alignment:this.QCObject.alignment,
      consistentFormatting:this.QCObject.consistentFormatting,
      accuracy:this.QCObject.accuracy,
      tablesComment:this.QCObject.tablesComment,
      referenceConsistency:this.QCObject.referenceConsistency,
      referenceComment:this.QCObject.referenceComment,
      acronyms:this.QCObject.acronyms,
      fonts:this.QCObject.fonts,
      highlighting:this.QCObject.highlighting,
      styling:this.QCObject.styling,
      spell:this.QCObject.spell,
      generalComment:this.QCObject.generalComment
    });
   
    this.taskQC1Observable=this.database.list(`${this.taskId}/qaqc`);
        this.taskQC1Observable.subscribe((task)=>{
          this.taskArray=task;
        
        });

  this.QCObservableObject=this.database.object(`${this.taskId}/qaqc`);
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

qc="";
submitQC1(){
  this.taskQC1Observable.push({
    coverPage:this.QCObject.coverPage,
    tableContents:this.QCObject.tableContents,
    executiveSummary:this.QCObject.executiveSummary,
    frontComment:this.QCObject.frontComment,
    matchNumbers:this.QCObject.matchNumbers,
    significantDigits:this.QCObject.significantDigits,
    updatedFigures:this.QCObject.updatedFigures,
    alignment:this.QCObject.alignment,
    consistentFormatting:this.QCObject.consistentFormatting,
    accuracy:this.QCObject.accuracy,
    tablesComment:this.QCObject.tablesComment,
    referenceConsistency:this.QCObject.referenceConsistency,
    referenceComment:this.QCObject.referenceComment,
    acronyms:this.QCObject.acronyms,
    fonts:this.QCObject.fonts,
    highlighting:this.QCObject.highlighting,
    styling:this.QCObject.styling,
    spell:this.QCObject.spell,

    generalComment:this.QCObject.generalComment
  }).then((a)=>{
    let key=a.getKey();

      this.QCId=key;
      this.getTask(this.QCId);
  });
    
  
}
qcArray:Array<any>=[];
getTask(key){
  this.QCObservableObject=this.database.object(`${this.taskId}/qaqc/${this.QCId}`);
  this.QCId=this.QCId;
  this.QCObservableObject.subscribe((a)=>{
    
     this.qcArray.push(a);
    this.QCObject=this.qcArray[0]
    
   
  })
}

editQC1(){
 let QCEditObs;

 QCEditObs=this.database.object(`${this.taskId}/qaqc/${this.qc}`);

 QCEditObs.update({
    coverPage:this.QCObject.coverPage,
     tableContents:this.QCObject.tableContents,
    executiveSummary:this.QCObject.executiveSummary,
    frontComment:this.QCObject.frontComment,
    matchNumbers:this.QCObject.matchNumbers,
    significantDigits:this.QCObject.significantDigits,
    updatedFigures:this.QCObject.updatedFigures,
    alignment:this.QCObject.alignment,
    consistentFormatting:this.QCObject.consistentFormatting,
    accuracy:this.QCObject.accuracy,
    tablesComment:this.QCObject.tablesComment,
    referenceConsistency:this.QCObject.referenceConsistency,
    referenceComment:this.QCObject.referenceComment,
    acronyms:this.QCObject.acronyms,
    fonts:this.QCObject.fonts,
    highlighting:this.QCObject.highlighting,
    styling:this.QCObject.styling,
    spell:this.QCObject.spell,
    generalComment:this.QCObject.generalComment,
    add:false
 })
 
}

}
