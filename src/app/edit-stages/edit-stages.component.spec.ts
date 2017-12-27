import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStagesComponent } from './edit-stages.component';

describe('EditStagesComponent', () => {
  let component: EditStagesComponent;
  let fixture: ComponentFixture<EditStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
