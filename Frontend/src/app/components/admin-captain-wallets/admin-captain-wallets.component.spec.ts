import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCaptainWalletsComponent } from './admin-captain-wallets.component';

describe('AdminCaptainWalletsComponent', () => {
  let component: AdminCaptainWalletsComponent;
  let fixture: ComponentFixture<AdminCaptainWalletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCaptainWalletsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCaptainWalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
