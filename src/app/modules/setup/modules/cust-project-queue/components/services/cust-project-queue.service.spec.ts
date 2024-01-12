import { TestBed } from '@angular/core/testing';

import { CustProjectQueueService } from './cust-project-queue.service';

describe('CustProjectQueueService', () => {
  let service: CustProjectQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustProjectQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
