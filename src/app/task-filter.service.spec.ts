import { TestBed, inject } from '@angular/core/testing';

import { TaskFilterService } from './task-filter.service';

describe('TaskFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskFilterService]
    });
  });

  it('should be created', inject([TaskFilterService], (service: TaskFilterService) => {
    expect(service).toBeTruthy();
  }));
});
