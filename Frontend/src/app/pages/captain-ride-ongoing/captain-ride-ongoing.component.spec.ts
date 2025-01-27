import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptainRideOngoingComponent } from './captain-ride-ongoing.component';

describe('CaptainRideOngoingComponent', () => {
  let component: CaptainRideOngoingComponent;
  let fixture: ComponentFixture<CaptainRideOngoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptainRideOngoingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptainRideOngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
