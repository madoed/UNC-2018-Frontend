import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingForOwnerComponent } from './meeting-for-owner.component';

describe('MeetingForOwnerComponent', () => {
  let component: MeetingForOwnerComponent;
  let fixture: ComponentFixture<MeetingForOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingForOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingForOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
