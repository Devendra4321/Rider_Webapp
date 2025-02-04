import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidePopupComponent } from './ride-popup.component';

describe('RidePopupComponent', () => {
  let component: RidePopupComponent;
  let fixture: ComponentFixture<RidePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RidePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RidePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
