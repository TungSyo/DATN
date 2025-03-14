import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendEmailOtpComponent } from './resend-email-otp.component';

describe('ResendEmailOtpComponent', () => {
  let component: ResendEmailOtpComponent;
  let fixture: ComponentFixture<ResendEmailOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResendEmailOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResendEmailOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
