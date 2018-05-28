import { Component, OnInit, Input } from '@angular/core';

import { Column } from './../gird.models';

@Component({
  selector: 'gird-table-mock',
  template: `<table>
            <thead></thead>
            <tbody></tbody>
            </table>`,
  
})
export class TableComponent implements OnInit {

  /**
   * Data columns
   */
  private _columns: Column[];
  @Input() get columns(){
    return this._columns;
  }
  set columns(args: Column[]){
    this._columns = args;
  }

  private _rows: any[];
  @Input() get rows(){
    return this._rows;
  }
  set rows(args: any[]){
    this._rows = args;
  }

  objectKeys = Object.keys;

  @Input('table-css-classes') tableClasses: string;

  constructor() { }


  ngOnInit() {
  }

}
