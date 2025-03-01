import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCaptainsRequestComponent } from './admin-captains-request.component';

describe('AdminCaptainsRequestComponent', () => {
  let component: AdminCaptainsRequestComponent;
  let fixture: ComponentFixture<AdminCaptainsRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCaptainsRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCaptainsRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
