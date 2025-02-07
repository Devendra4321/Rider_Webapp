import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authCaptainGuard } from './auth-captain.guard';

describe('authCaptainGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authCaptainGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
