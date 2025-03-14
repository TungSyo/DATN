import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryUserComponent } from './order-history-user.component';

describe('OrderHistoryUserComponent', () => {
  let component: OrderHistoryUserComponent;
  let fixture: ComponentFixture<OrderHistoryUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderHistoryUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderHistoryUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
