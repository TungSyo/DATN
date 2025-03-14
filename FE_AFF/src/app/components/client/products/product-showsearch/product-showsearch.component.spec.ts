import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShowsearchComponent } from './product-showsearch.component';

describe('ProductShowsearchComponent', () => {
  let component: ProductShowsearchComponent;
  let fixture: ComponentFixture<ProductShowsearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductShowsearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductShowsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
