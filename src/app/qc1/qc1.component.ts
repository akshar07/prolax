import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { QC1 } from './qc1';
import { ProjectService } from '../home/project.service';

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
timelineId:string;
@Input()
isManager:string;
taskQC1Observable: FirebaseListObservable<any[]>;
database:any;
inputsForm:FormGroup;
  constructor(private fb:FormBuilder, private db: AngularFireDatabase,private projectService:ProjectService) { 
      // this.database=db;
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
   this.projectService.getQC1(this.timelineId,this.taskId)
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

qc="";
submitQC1(){
  this.projectService.addQC1(this.timelineId, this.taskId,{
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
editQC1(){
  this.projectService.editqC1(this.taskId,this.timelineId,{
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
