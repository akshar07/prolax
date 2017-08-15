import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,AbstractControl } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-qc-results',
  templateUrl: './qc-results.component.html',
  styleUrls: ['./qc-results.component.css']
})
export class QcResultsComponent implements OnInit {
  commentsArray: any[];
  @Input()
taskId:string;

taskCommentsObservable: FirebaseListObservable<any[]>;
database:any;
  constructor(private fb:FormBuilder, private db: AngularFireDatabase,private authService:AuthService, private auth: AngularFireAuth) { 
      this.database=db;
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
          this.taskCommentsObservable=this.database.list(`${this.taskId}/comments`);
        this.taskCommentsObservable.subscribe((comment)=>{
          this.commentsArray=comment;
          console.log(this.commentsArray)
        });
  }
      setUser(user:string){
        this.user=user;
      }
submitComment(){
 let d1 = new Date();

  console.log(this.chat)
 this.taskCommentsObservable.push({chat:this.chat,user:this.user,date:d1.toDateString()});
 this.inputsForm.reset();
}

}
