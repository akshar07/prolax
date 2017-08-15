import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Qc2Component } from './qc2.component';

describe('Qc2Component', () => {
  let component: Qc2Component;
  let fixture: ComponentFixture<Qc2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Qc2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Qc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
