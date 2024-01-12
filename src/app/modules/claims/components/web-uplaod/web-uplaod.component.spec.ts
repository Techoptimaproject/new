import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebUplaodComponent } from './web-uplaod.component';

describe('WebUplaodComponent', () => {
  let component: WebUplaodComponent;
  let fixture: ComponentFixture<WebUplaodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebUplaodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebUplaodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
