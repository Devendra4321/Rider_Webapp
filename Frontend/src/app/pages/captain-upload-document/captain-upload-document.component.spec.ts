import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptainUploadDocumentComponent } from './captain-upload-document.component';

describe('CaptainUploadDocumentComponent', () => {
  let component: CaptainUploadDocumentComponent;
  let fixture: ComponentFixture<CaptainUploadDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptainUploadDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptainUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
