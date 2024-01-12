import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcfaClaimComponent } from './hcfa-claim.component';

describe('HcfaClaimComponent', () => {
  let component: HcfaClaimComponent;
  let fixture: ComponentFixture<HcfaClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcfaClaimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HcfaClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
