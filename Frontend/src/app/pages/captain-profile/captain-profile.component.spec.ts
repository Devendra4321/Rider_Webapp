import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptainProfileComponent } from './captain-profile.component';

describe('CaptainProfileComponent', () => {
  let component: CaptainProfileComponent;
  let fixture: ComponentFixture<CaptainProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptainProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptainProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
