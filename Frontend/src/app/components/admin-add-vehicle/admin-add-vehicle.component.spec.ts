import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddVehicleComponent } from './admin-add-vehicle.component';

describe('AdminAddVehicleComponent', () => {
  let component: AdminAddVehicleComponent;
  let fixture: ComponentFixture<AdminAddVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAddVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
