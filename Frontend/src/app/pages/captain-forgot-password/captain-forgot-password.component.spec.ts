import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptainForgotPasswordComponent } from './captain-forgot-password.component';

describe('CaptainForgotPasswordComponent', () => {
  let component: CaptainForgotPasswordComponent;
  let fixture: ComponentFixture<CaptainForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptainForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptainForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
