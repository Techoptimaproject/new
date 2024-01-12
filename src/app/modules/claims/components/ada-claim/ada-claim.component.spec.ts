import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaClaimComponent } from './ada-claim.component';

describe('AdaClaimComponent', () => {
  let component: AdaClaimComponent;
  let fixture: ComponentFixture<AdaClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdaClaimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdaClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
