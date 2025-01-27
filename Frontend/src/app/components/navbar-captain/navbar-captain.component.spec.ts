import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCaptainComponent } from './navbar-captain.component';

describe('NavbarCaptainComponent', () => {
  let component: NavbarCaptainComponent;
  let fixture: ComponentFixture<NavbarCaptainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarCaptainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarCaptainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
