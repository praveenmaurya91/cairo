import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFacilityComponent } from './view-facility.component';

describe('ViewFacilityComponent', () => {
  let component: ViewFacilityComponent;
  let fixture: ComponentFixture<ViewFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
