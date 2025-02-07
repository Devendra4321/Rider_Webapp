import { TestBed } from '@angular/core/testing';

import { GetRideAllService } from './get-ride-all.service';

describe('GetRideAllService', () => {
  let service: GetRideAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRideAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
