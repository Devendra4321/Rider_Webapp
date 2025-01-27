import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletUserComponent } from './wallet-user.component';

describe('WalletUserComponent', () => {
  let component: WalletUserComponent;
  let fixture: ComponentFixture<WalletUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
