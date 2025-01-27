import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptainTripsComponent } from './captain-trips.component';

describe('CaptainTripsComponent', () => {
  let component: CaptainTripsComponent;
  let fixture: ComponentFixture<CaptainTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptainTripsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptainTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
