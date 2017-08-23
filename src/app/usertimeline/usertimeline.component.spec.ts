import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertimelineComponent } from './usertimeline.component';

describe('UsertimelineComponent', () => {
  let component: UsertimelineComponent;
  let fixture: ComponentFixture<UsertimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsertimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
