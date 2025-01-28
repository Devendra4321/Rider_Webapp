import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCaptainComponent } from './wallet-captain.component';

describe('WalletCaptainComponent', () => {
  let component: WalletCaptainComponent;
  let fixture: ComponentFixture<WalletCaptainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletCaptainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletCaptainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
