import { TestBed } from '@angular/core/testing';

import { ChannelService } from './core/services/channel.service';

describe('ChannelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChannelService = TestBed.get(ChannelService);
    expect(service).toBeTruthy();
  });
});
