import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Qc1Component } from './qc1.component';

describe('Qc1Component', () => {
  let component: Qc1Component;
  let fixture: ComponentFixture<Qc1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Qc1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Qc1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
