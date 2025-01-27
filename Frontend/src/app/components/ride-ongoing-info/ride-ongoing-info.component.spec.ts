import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideOngoingInfoComponent } from './ride-ongoing-info.component';

describe('RideOngoingInfoComponent', () => {
  let component: RideOngoingInfoComponent;
  let fixture: ComponentFixture<RideOngoingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideOngoingInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideOngoingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
