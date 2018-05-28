import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gird-page-mock',
  template:
  `<div>
    
  </div>`
})
export class PageComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  }

  
  private _pageCount: number;
  set pageCount(arg: number){
    if(arg === this._pageCount){
      return;
    }

    this._pageCount = arg;
    let min = (this.currentPageNumber * this.rowsPerPage) - this.rowsPerPage + 1;
    let max = this.rowsPerPage * this.currentPageNumber;
    this.onPageChange.emit([min, max]);
    console.log(`pageChange emitted from pageCount. [min: ${min}, max: ${max}]`);
  }
  get pageCount(){
    return this._pageCount;
  }



  private _rowsPerPage: number = 10;
  get rowsPerPage(){
    return this._rowsPerPage;
  }

  set rowsPerPage(arg: number){
    console.log(arg);
    if(isNaN(arg) || arg < 1){
      throw new Error(`Invalid value ${arg} for rows-per-page! Should be > 0`);
    }
    this._rowsPerPage = arg;
    this.pageCount = Math.ceil(this._totalRows / this._rowsPerPage);
    if(this.pageCount < this.currentPageNumber){
      this.currentPageNumber = this.pageCount;
    }
    console.log(`rowsPerPage: Rows per page: ${this._rowsPerPage}, pageCount: ${this.pageCount}`);
  }


  private _totalRows: number;
  @Input('rows-count') get totalRows(){
    return this._totalRows;
  }

  set totalRows(arg: number){
    this._totalRows = arg;
    this.pageCount = Math.ceil(this._totalRows / this._rowsPerPage);
  }

  @Output() onPageChange = new EventEmitter<number[]>();

  
  private _currentPageNumber: number = 1;
  set currentPageNumber(arg: number){
    if(arg === this._currentPageNumber || arg > this.pageCount){
      return;
    }

    this._currentPageNumber = arg;
    let min = (arg * this.rowsPerPage) - this.rowsPerPage + 1;
    let max = this.rowsPerPage * arg;
    this.onPageChange.emit([min, max]);
    console.log(`pageChange emitted from currentPageNumber. [min: ${min}, max: ${max}]`);
  }
  get currentPageNumber(){
    return this._currentPageNumber;
  }


  nextClickHandler(){
    let next = this.currentPageNumber + 1;
    this.currentPageNumber = next>this.pageCount?this.currentPageNumber:next;
  }

  lastClickHandler(){
    this.currentPageNumber = this.pageCount;
  }

  prevClickHandler(){
    let next = this.currentPageNumber - 1;
    this.currentPageNumber = next<1?1:next;
  }

  firstClickHandler(){
    this.currentPageNumber = 1;
  }
}
