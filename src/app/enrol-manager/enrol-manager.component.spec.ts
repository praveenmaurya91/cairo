import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolManagerComponent } from './enrol-manager.component';

describe('EnrolManagerComponent', () => {
  let component: EnrolManagerComponent;
  let fixture: ComponentFixture<EnrolManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
