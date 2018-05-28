import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule} from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

import { PageComponent } from './page.component';


@Component({
  selector: `host-component`,
  template: `<gird-page [rows-count]="rowsCount" (onPageChange)="onPageChangeHandler($event)"></gird-page>`
})
class TestHostComponent{
  @ViewChild(PageComponent)
  public pageComponent: PageComponent;
  rowsCount: number = 110;
  
  slot: number[];

  onPageChangeHandler(slot){
    this.slot = slot;
  }
}

describe('PageComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let pageComponent: PageComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageComponent, TestHostComponent ],
      imports:[FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    pageComponent = hostComponent.pageComponent;
    fixture.detectChanges();
  });

  it('should create host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should update page count on providing total rows.', ()=>{
    expect(pageComponent.totalRows).toBe(hostComponent.rowsCount);
    expect(pageComponent.rowsPerPage).toBe(10);
    expect(pageComponent.pageCount).toBe(11); // = 110 rows / 10 rows/page
    expect(pageComponent.currentPageNumber).toBe(1);
    pageComponent.totalRows = 83;
    expect(pageComponent.pageCount).toBe(9); // = 83 rows / 10 rows/page    
  });

  it('should update current page on nextPageEvent', ()=>{
    pageComponent.nextClickHandler();
    expect(pageComponent.currentPageNumber).toBe(2);
    pageComponent.nextClickHandler();
    expect(pageComponent.currentPageNumber).toBe(3);
    pageComponent.nextClickHandler();
    expect(pageComponent.currentPageNumber).toBe(4);
  });

  it('should update current page on prevPageEvent', ()=>{
    pageComponent.currentPageNumber = 3;
    pageComponent.prevClickHandler();
    expect(pageComponent.currentPageNumber).toBe(2);
    pageComponent.prevClickHandler();
    expect(pageComponent.currentPageNumber).toBe(1);
    pageComponent.prevClickHandler();
    expect(pageComponent.currentPageNumber).toBe(1);
  });

  it('should update current page on lastPageEvent', ()=>{
    
    pageComponent.lastClickHandler();
    expect(pageComponent.currentPageNumber).toBe(11);
    pageComponent.lastClickHandler();
    expect(pageComponent.currentPageNumber).toBe(11);
    
  });

  it('should update current page on firstPageEvent', ()=>{
    
    pageComponent.currentPageNumber = 10;
    pageComponent.firstClickHandler();
    expect(pageComponent.currentPageNumber).toBe(1);
    pageComponent.firstClickHandler();
    expect(pageComponent.currentPageNumber).toBe(1);
    
  });

  it('should emit current slot on total rows count change', ()=>{

    hostComponent.rowsCount = 83;
    expect(hostComponent.slot).toBeTruthy();
    expect(hostComponent.slot.length).toBe(2);
    expect(hostComponent.slot[0]).toBe(0);
    expect(hostComponent.slot[1]).toBe(10);
  });

  it('should emit current slot on total rows count change', ()=>{

    hostComponent.rowsCount = 83;
    expect(hostComponent.slot).toBeTruthy();
    expect(hostComponent.slot.length).toBe(2);
    expect(hostComponent.slot[0]).toBe(0);
    expect(hostComponent.slot[1]).toBe(10);
  });

  it('should change pagecount on changing rowPerPage', ()=>{

    pageComponent.rowsPerPage = 15;
    expect(pageComponent.pageCount).toBe(8); // = 110 rows / 15 rows/page

    pageComponent.rowsPerPage = 25;
    expect(pageComponent.pageCount).toBe(5); // = 110 rows / 15 rows/page

    pageComponent.rowsPerPage = 50;
    expect(pageComponent.pageCount).toBe(3); // = 110 rows / 15 rows/page

  });

  it('should emit slot on rowsPerPage change on first page', ()=>{
    pageComponent.rowsPerPage = 15;
    expect(hostComponent.slot[0]).toBe(0);
    expect(hostComponent.slot[1]).toBe(15);

    pageComponent.rowsPerPage = 25;
    expect(hostComponent.slot[0]).toBe(0);
    expect(hostComponent.slot[1]).toBe(25);


    pageComponent.rowsPerPage = 50;
    expect(hostComponent.slot[0]).toBe(0);
    expect(hostComponent.slot[1]).toBe(50);
  });

  it('should emit slot on rowsPerPage change on third page', ()=>{
    pageComponent.currentPageNumber = 3;
    pageComponent.rowsPerPage = 15;
    expect(hostComponent.slot[0]).toBe(30);
    expect(hostComponent.slot[1]).toBe(45);

    pageComponent.rowsPerPage = 25;
    expect(hostComponent.slot[0]).toBe(50);
    expect(hostComponent.slot[1]).toBe(75);


    pageComponent.rowsPerPage = 50;
    expect(hostComponent.slot[0]).toBe(100);
    expect(hostComponent.slot[1]).toBe(150);
  });
});
