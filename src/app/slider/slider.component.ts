import { Component, OnInit, Input } from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import { ManagerService } from '../home/manager.service';
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
   animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class SliderComponent implements OnInit{
  @Input()
  userName: any;
  @Input()
  userImage: any;
  constructor(private managerService: ManagerService) {

  }
menuState:string = 'out';
  toggleMenu() {
     this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }
  ngOnInit(){
  }
}