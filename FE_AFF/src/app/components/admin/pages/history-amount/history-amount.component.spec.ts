import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAmountComponent } from './history-amount.component';

describe('HistoryAmountComponent', () => {
  let component: HistoryAmountComponent;
  let fixture: ComponentFixture<HistoryAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryAmountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
