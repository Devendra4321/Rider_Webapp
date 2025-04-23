import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideChatComponent } from './ride-chat.component';

describe('RideChatComponent', () => {
  let component: RideChatComponent;
  let fixture: ComponentFixture<RideChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
