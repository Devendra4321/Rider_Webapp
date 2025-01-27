import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptainTripsByIdComponent } from './captain-trips-by-id.component';

describe('CaptainTripsByIdComponent', () => {
  let component: CaptainTripsByIdComponent;
  let fixture: ComponentFixture<CaptainTripsByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptainTripsByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptainTripsByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
