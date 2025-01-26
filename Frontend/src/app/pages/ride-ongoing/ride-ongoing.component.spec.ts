import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideOngoingComponent } from './ride-ongoing.component';

describe('RideOngoingComponent', () => {
  let component: RideOngoingComponent;
  let fixture: ComponentFixture<RideOngoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideOngoingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideOngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
