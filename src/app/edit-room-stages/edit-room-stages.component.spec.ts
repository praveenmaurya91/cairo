import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoomStagesComponent } from './edit-room-stages.component';

describe('EditRoomStagesComponent', () => {
  let component: EditRoomStagesComponent;
  let fixture: ComponentFixture<EditRoomStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRoomStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoomStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
