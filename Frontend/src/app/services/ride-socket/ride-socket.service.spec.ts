import { TestBed } from '@angular/core/testing';

import { RideSocketService } from './ride-socket.service';

describe('RideSocketService', () => {
  let service: RideSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
