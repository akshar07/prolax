import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-usertimeline',
  templateUrl: './usertimeline.component.html',
  styleUrls: ['./usertimeline.component.css']
})
export class UsertimelineComponent implements OnInit {
@Input()
projects:any;
  constructor() { }

  ngOnInit() {
    console.log(this.projects)
  }

}
