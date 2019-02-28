import { TestBed } from '@angular/core/testing';

import { MeetingService } from './core/services/meeting.service';

describe('MeetingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetingService = TestBed.get(MeetingService);
    expect(service).toBeTruthy();
  });
});
