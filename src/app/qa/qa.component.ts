import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.css']
})
export class QaComponent implements OnInit {
  id: any;
  projectToShow: any;
  database: AngularFireDatabase;
  inputsForm: FormGroup
constructor(private fb:FormBuilder,private route: ActivatedRoute,private db: AngularFireDatabase,) { 
  this.database=db;
}
  sub:any;
  ngOnInit() {
     this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];
       console.log(this.id);
     
    });  
   this.database.object('projects/'+this.id ).subscribe((res)=>{
         this.projectToShow=res;
        
  });

  }
}
