import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeBinaryComponent } from './tree-binary.component';

describe('TreeBinaryComponent', () => {
  let component: TreeBinaryComponent;
  let fixture: ComponentFixture<TreeBinaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeBinaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreeBinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
