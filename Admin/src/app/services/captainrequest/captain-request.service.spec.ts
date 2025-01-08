import { TestBed } from '@angular/core/testing';

import { CaptainRequestService } from './captain-request.service';

describe('CaptainRequestService', () => {
  let service: CaptainRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptainRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
