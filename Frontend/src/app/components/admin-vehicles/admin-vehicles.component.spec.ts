import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVehiclesComponent } from './admin-vehicles.component';

describe('AdminVehiclesComponent', () => {
  let component: AdminVehiclesComponent;
  let fixture: ComponentFixture<AdminVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
