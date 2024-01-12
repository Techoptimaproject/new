import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterQueueComponent } from './master-queue.component';

describe('MasterQueueComponent', () => {
  let component: MasterQueueComponent;
  let fixture: ComponentFixture<MasterQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterQueueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
