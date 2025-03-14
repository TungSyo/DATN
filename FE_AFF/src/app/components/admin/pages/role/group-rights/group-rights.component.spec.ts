import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRightsComponent } from './group-rights.component';

describe('GroupRightsComponent', () => {
  let component: GroupRightsComponent;
  let fixture: ComponentFixture<GroupRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
