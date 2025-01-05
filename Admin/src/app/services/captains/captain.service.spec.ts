import { TestBed } from '@angular/core/testing';

import { CaptainService } from './captain.service';

describe('CaptainService', () => {
  let service: CaptainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
