import { TestBed } from '@angular/core/testing';

import { CaptainWalletService } from './captain-wallet.service';

describe('CaptainWalletService', () => {
  let service: CaptainWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptainWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
