import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCaptainsComponent } from './admin-captains.component';

describe('AdminCaptainsComponent', () => {
  let component: AdminCaptainsComponent;
  let fixture: ComponentFixture<AdminCaptainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCaptainsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCaptainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
