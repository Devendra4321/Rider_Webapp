import { TestBed } from '@angular/core/testing';

import { UserWalletService } from './user-wallet.service';

describe('UserWalletService', () => {
  let service: UserWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
