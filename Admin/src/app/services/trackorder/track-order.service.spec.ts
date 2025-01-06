import { TestBed } from '@angular/core/testing';

import { TrackOrderService } from './track-order.service';

describe('TrackOrderService', () => {
  let service: TrackOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
