import { TestBed } from '@angular/core/testing';

import { PollService } from './core/services/poll.service';

describe('PollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PollService = TestBed.get(PollService);
    expect(service).toBeTruthy();
  });
});
