/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WithdrawService } from './withdraw.service';

describe('Service: Withdraw', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WithdrawService]
    });
  });

  it('should ...', inject([WithdrawService], (service: WithdrawService) => {
    expect(service).toBeTruthy();
  }));
});
