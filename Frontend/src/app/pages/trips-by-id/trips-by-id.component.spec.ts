import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsByIdComponent } from './trips-by-id.component';

describe('TripsByIdComponent', () => {
  let component: TripsByIdComponent;
  let fixture: ComponentFixture<TripsByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripsByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripsByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
