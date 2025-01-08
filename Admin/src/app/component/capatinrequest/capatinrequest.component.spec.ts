import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapatinrequestComponent } from './capatinrequest.component';

describe('CapatinrequestComponent', () => {
  let component: CapatinrequestComponent;
  let fixture: ComponentFixture<CapatinrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapatinrequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapatinrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
