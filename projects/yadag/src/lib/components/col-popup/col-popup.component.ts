import { Component, OnInit, Input } from '@angular/core';
import { Column } from '../../gird.models';

@Component({
  selector: 'col-popup',
  templateUrl: './col-popup.component.html',
  styleUrls: ['./col-popup.component.css']
})
export class ColPopupComponent implements OnInit {

  isColFilterApplied = false;
  private _sourceColumns: Column[];

  @Input('source-columns') set sourceColumns(args: Column[]){
    this._sourceColumns = args;
    this.isColFilterApplied = !args.every(col => col.visible);
  }

  get sourceColumns(){
    return this._sourceColumns;
  }

  constructor() { }

  ngOnInit() {
  }

  onColCbChangeHandler(dataProperty){
    let col = this._sourceColumns.find(f => f.dataProperty == dataProperty);
    col.visible = !col.visible;
    this.isColFilterApplied = !this._sourceColumns.every(col => col.visible);    
  }
}
