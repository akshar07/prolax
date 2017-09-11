import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
@Input()
users:any
@Output() onUserSelect: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }
  ngOnInit() {
    console.log(this.users)
    this.myOptions = this.users.map((manager,i)=>{
      return {id:{key:manager.short_name,name:manager.user_name},name:manager.user_name,url:manager.url}
    })
  }
  onChange() {
    console.log(this.optionsModel)
    this.onUserSelect.emit(this.optionsModel);
}
  optionsModel: [{key:"",name:""}];
  myOptions: IMultiSelectOption[];
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    defaultTitle: 'Select',
    allSelected: 'All selected',
};
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 4,
    displayAllSelectedText: true
};

}
