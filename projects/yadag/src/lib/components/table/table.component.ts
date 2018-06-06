import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

import * as moment from 'moment';

import { Column, ColDataType, Criteria } from './../../gird.models';


@Component({
  selector: 'gird-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  stringCriteriaMap = new Map<Criteria, string>();
  numberCriteriaMap = new Map<Criteria, string>();
  dateCriteriaMap = new Map<Criteria, string>();

  DateDataType = ColDataType.Date;
  StringDataType = ColDataType.String;
  NumberDataType = ColDataType.Number;
  BoolDataType = ColDataType.Bool;
  AnchorDataType = ColDataType.Anchor;
  PopupDataType = ColDataType.Popup;
  ButtonDataType = ColDataType.Button;

  momentFunc = moment;
  
  @Input('footer-row') footerRow: {
    cols: string[],
    valuesMap: Map<string, string>
  };

  ngOnInit() {
    this.stringCriteriaMap.set(Criteria.EqualsTo,"Equals To");
    this.numberCriteriaMap.set(Criteria.EqualsTo,"Equals To");
    this.dateCriteriaMap.set(Criteria.EqualsTo,"Equals To");
    

    this.stringCriteriaMap.set(Criteria.DoesNotEqualTo,"Does Equal To");
    this.numberCriteriaMap.set(Criteria.DoesNotEqualTo,"Does Equal To");
    this.dateCriteriaMap.set(Criteria.DoesNotEqualTo,"Does Equal To");
    

    this.stringCriteriaMap.set(Criteria.Contains, "Contains");
    this.stringCriteriaMap.set(Criteria.DoesNotContain, "Does Not Contain");
    
    this.numberCriteriaMap.set(Criteria.GreaterThan, "Greater Than");
    this.numberCriteriaMap.set(Criteria.GreaterOrEqualTo, "Greater or Equal To");
    this.numberCriteriaMap.set(Criteria.LessThan, "Less Than");
    this.numberCriteriaMap.set(Criteria.LessThan, "Less or Equal To");
    
    this.dateCriteriaMap.set(Criteria.AfterThan, "After Than");
    this.dateCriteriaMap.set(Criteria.AfterOrEqualTo, "After or Equal To");
    this.dateCriteriaMap.set(Criteria.BeforeThan, "Before Than");
    this.dateCriteriaMap.set(Criteria.BeforeOrEqualTo, "Before or Equal To");
    
  }

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

  sourceRows: any[];
  @Input() get rows(){
    return this.sourceRows;
  }
  set rows(args: any[]){
    this.sourceRows = args;
    
  }

  @Output('on-column-click') onColumnClickEvent = new EventEmitter<any>();

  emitClickOnColumn(eventData, col){
    eventData.dataProperty = col;
     this.onColumnClickEvent.emit(eventData);
  }

  objectKeys = Object.keys;

  @Input('table-css-classes') tableClasses: string;

  @Input('row-tracking-id') trackerId: string;

  trackerFunc(index, obj){
    if(!this.trackerId){
      return index;
    }
    
    return obj? obj[this.trackerId]:undefined;
  }
}