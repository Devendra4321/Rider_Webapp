import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCaptainComponent } from './login-captain.component';

describe('LoginCaptainComponent', () => {
  let component: LoginCaptainComponent;
  let fixture: ComponentFixture<LoginCaptainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginCaptainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCaptainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
