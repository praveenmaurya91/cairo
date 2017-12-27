import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustRoomCycleComponent } from './adjust-room-cycle.component';

describe('AdjustRoomCycleComponent', () => {
  let component: AdjustRoomCycleComponent;
  let fixture: ComponentFixture<AdjustRoomCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustRoomCycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustRoomCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
