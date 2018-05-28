import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gird-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  }

  
  private _pageCount: number;
  set pageCount(arg: number){
    // if(arg === this._pageCount){
    //   return;
    // }
    
    this._pageCount = arg;
    this.emitPageChange();
    
  }
  get pageCount(){
    return this._pageCount;
  }

  private emitPageChange(){
    let min = (this.currentPageNumber * this.rowsPerPage) - this.rowsPerPage;
    let max = this.rowsPerPage * this.currentPageNumber;
    this.onPageChange.emit([min, max]);
  }

  private _rowsPerPage: number = 10;
  @Input('rows-per-page') get rowsPerPage(){
    return this._rowsPerPage;
  }

  set rowsPerPage(arg: number){
    
    if(isNaN(arg) || arg < 1){
      throw new Error(`Invalid value ${arg} for rows-per-page! Should be > 0`);
    }
    this._rowsPerPage = arg;
    this.pageCount = Math.ceil(this._totalRows / this._rowsPerPage);
    this.currentPageNumber = 1;
    
  }


  private _totalRows: number;
  @Input('rows-count') get totalRows(){
    return this._totalRows;
  }

  set totalRows(arg: number){
    this._totalRows = arg;
    this.currentPageNumber = 1;
    this.pageCount = Math.ceil(this._totalRows / this._rowsPerPage);
    
  }

  @Output() onPageChange = new EventEmitter<number[]>();

  
  private _currentPageNumber: number = 1;
  set currentPageNumber(arg: number){
    if(arg > this.pageCount){
      return;
    }

    this._currentPageNumber = arg;
    this.emitPageChange();
  }
  get currentPageNumber(){
    return this._currentPageNumber;
  }


  nextClickHandler(event){
    let next = this.currentPageNumber + 1;
    this.currentPageNumber = next>this.pageCount?this.currentPageNumber:next;
  }

  lastClickHandler(event){
    this.currentPageNumber = this.pageCount;
  }

  prevClickHandler(event){
    let next = this.currentPageNumber - 1;
    this.currentPageNumber = next<1?1:next;
  }

  firstClickHandler(event){
    this.currentPageNumber = 1;
  }

  forcePageRefresh(){
    this.emitPageChange();
  }
}
