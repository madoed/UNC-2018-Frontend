import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAddComponent } from './chat-add.component';

describe('ChatAddComponent', () => {
  let component: ChatAddComponent;
  let fixture: ComponentFixture<ChatAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
