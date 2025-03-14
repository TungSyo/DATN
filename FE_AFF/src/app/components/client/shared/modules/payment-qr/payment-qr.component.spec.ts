import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentQrComponent } from './payment-qr.component';

describe('PaymentQrComponent', () => {
  let component: PaymentQrComponent;
  let fixture: ComponentFixture<PaymentQrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentQrComponent]
    });
    fixture = TestBed.createComponent(PaymentQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
