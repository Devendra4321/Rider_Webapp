import { TestBed } from '@angular/core/testing';

import { CaptainLoginService } from './captain-login.service';

describe('CaptainLoginService', () => {
  let service: CaptainLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptainLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
