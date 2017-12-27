import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolFacilityComponent } from './enrol-facility.component';

describe('EnrolFacilityComponent', () => {
  let component: EnrolFacilityComponent;
  let fixture: ComponentFixture<EnrolFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
