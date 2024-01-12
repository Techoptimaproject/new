import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustProjectQueueComponent } from './cust-project-queue.component';

describe('CustProjectQueueComponent', () => {
  let component: CustProjectQueueComponent;
  let fixture: ComponentFixture<CustProjectQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustProjectQueueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustProjectQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
