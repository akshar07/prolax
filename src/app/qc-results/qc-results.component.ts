import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,AbstractControl } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-qc-results',
  templateUrl: './qc-results.component.html',
  styleUrls: ['./qc-results.component.css']
})
export class QcResultsComponent implements OnInit {
  commentsArray: any[];
  @Input()
  taskId:string;
  @Input()
  timelineId:string;

database:any;
  constructor(private fb:FormBuilder, private commentsService:CommentsService, private authService:AuthService, private auth: AngularFireAuth) { 
  }
inputsForm:FormGroup;
chat:string;
user:string;
  ngOnInit() {
    let user;
       this.auth.authState.subscribe((auth)=>{
          this.user= auth.displayName;
          this.setUser(auth.displayName)
       })

     this.inputsForm=this.fb.group({
       chat:this.chat
     });
     this.commentsService.getComments(this.timelineId,this.taskId)
       .subscribe(comments=>this.commentsArray=comments);
  }
      setUser(user:string){
        this.user=user;
      }
submitComment(){
 let d1 = new Date();
 this.commentsService.postComment(this.timelineId,this.taskId,{chat:this.chat,user:this.user,date:d1.toDateString()});
  console.log(this.chat)
 this.inputsForm.reset();
}

}
