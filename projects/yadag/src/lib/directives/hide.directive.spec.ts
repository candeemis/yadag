import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By }           from '@angular/platform-browser';


import { HideDirective } from './hide.directive';

@Component({
selector: 'test-component',
template: `<div> <button id='btnTest' [hide]='shouldHideButton'>OK</button> </div>`
})
class TestComponent{

  shouldHideButton: boolean = false;

}

describe('HideDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(()=>{
    TestBed.configureTestingModule({
      declarations: [ TestComponent, HideDirective ],
      providers: []
    })
    .compileComponents();
    fixture = TestBed.createComponent(TestComponent);
  })

  it('should not hide the element', () => {
    component = fixture.componentInstance;
    //component.shouldHideButton = false;
    
    let btn = fixture.debugElement.query(By.css('#btnTest')).nativeElement;
    
    let display = btn.style.display;

    expect(display).not.toBe('none');

  });
  it('should hide the element', () => {
    component = fixture.componentInstance;
    component.shouldHideButton = true;
    fixture.detectChanges();
    let btn = fixture.debugElement.query(By.css('#btnTest')).nativeElement;
    
    let display = btn.style.display;
    expect(display).toBe('none');

  });
});
