import { TestBed } from '@angular/core/testing';

import { LoadingUiService } from './loading-ui.service';

describe('LoadingUiService', () => {
  let service: LoadingUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
