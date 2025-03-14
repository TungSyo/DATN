import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoccumentComponent } from './doccument.component';

describe('DoccumentComponent', () => {
  let component: DoccumentComponent;
  let fixture: ComponentFixture<DoccumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoccumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoccumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
