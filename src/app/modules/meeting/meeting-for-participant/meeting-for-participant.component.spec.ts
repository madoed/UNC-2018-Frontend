import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingForParticipantComponent } from './meeting-for-participant.component';

describe('MeetingForParticipantComponent', () => {
  let component: MeetingForParticipantComponent;
  let fixture: ComponentFixture<MeetingForParticipantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingForParticipantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingForParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
