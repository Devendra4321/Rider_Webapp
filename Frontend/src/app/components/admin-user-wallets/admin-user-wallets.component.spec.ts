import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserWalletsComponent } from './admin-user-wallets.component';

describe('AdminUserWalletsComponent', () => {
  let component: AdminUserWalletsComponent;
  let fixture: ComponentFixture<AdminUserWalletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserWalletsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserWalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
