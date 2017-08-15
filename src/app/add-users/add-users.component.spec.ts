import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUSersComponent } from './add-users.component';

describe('AddUSersComponent', () => {
  let component: AddUSersComponent;
  let fixture: ComponentFixture<AddUSersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUSersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUSersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
