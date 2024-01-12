import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbClaimComponent } from './ub-claim.component';

describe('UbClaimComponent', () => {
  let component: UbClaimComponent;
  let fixture: ComponentFixture<UbClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbClaimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
