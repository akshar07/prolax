import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksTimelineComponent } from './tasks-timeline.component';

describe('TasksTimelineComponent', () => {
  let component: TasksTimelineComponent;
  let fixture: ComponentFixture<TasksTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
