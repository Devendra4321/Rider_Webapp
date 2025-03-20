import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddCouponsComponent } from './admin-add-coupons.component';

describe('AdminAddCouponsComponent', () => {
  let component: AdminAddCouponsComponent;
  let fixture: ComponentFixture<AdminAddCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAddCouponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
