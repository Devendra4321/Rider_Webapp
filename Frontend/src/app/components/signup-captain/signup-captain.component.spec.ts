import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupCaptainComponent } from './signup-captain.component';

describe('SignupCaptainComponent', () => {
  let component: SignupCaptainComponent;
  let fixture: ComponentFixture<SignupCaptainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupCaptainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupCaptainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
