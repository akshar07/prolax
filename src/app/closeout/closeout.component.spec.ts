import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseoutComponent } from './closeout.component';

describe('CloseoutComponent', () => {
  let component: CloseoutComponent;
  let fixture: ComponentFixture<CloseoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
