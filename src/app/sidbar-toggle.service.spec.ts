import { TestBed } from '@angular/core/testing';

import { SidbarToggleService } from './sidbar-toggle.service';

describe('SidbarToggleService', () => {
  let service: SidbarToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidbarToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
