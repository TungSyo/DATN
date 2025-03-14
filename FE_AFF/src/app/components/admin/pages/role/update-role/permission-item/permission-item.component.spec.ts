import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionItemComponent } from './permission-item.component';

describe('PermissionItemComponent', () => {
  let component: PermissionItemComponent;
  let fixture: ComponentFixture<PermissionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
