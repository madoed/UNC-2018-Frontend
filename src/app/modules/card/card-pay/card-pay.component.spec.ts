import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPayComponent } from './card-pay.component';

describe('CardPayComponent', () => {
  let component: CardPayComponent;
  let fixture: ComponentFixture<CardPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
