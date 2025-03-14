import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommissionsAccountComponent } from './list-commissions-account.component';

describe('ListCommissionsAccountComponent', () => {
  let component: ListCommissionsAccountComponent;
  let fixture: ComponentFixture<ListCommissionsAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCommissionsAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCommissionsAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
