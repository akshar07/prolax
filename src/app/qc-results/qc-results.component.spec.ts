import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcResultsComponent } from './qc-results.component';

describe('QcResultsComponent', () => {
  let component: QcResultsComponent;
  let fixture: ComponentFixture<QcResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
