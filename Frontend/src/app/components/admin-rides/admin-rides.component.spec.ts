import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRidesComponent } from './admin-rides.component';

describe('AdminRidesComponent', () => {
  let component: AdminRidesComponent;
  let fixture: ComponentFixture<AdminRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
