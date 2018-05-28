import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColPopupComponent } from './col-popup.component';

describe('ColPopupComponent', () => {
  let component: ColPopupComponent;
  let fixture: ComponentFixture<ColPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
