import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPayComponent } from './check-pay.component';

describe('CheckPayComponent', () => {
  let component: CheckPayComponent;
  let fixture: ComponentFixture<CheckPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
