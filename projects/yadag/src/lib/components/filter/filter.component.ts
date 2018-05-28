import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

import { Column, ColDataType, FilterCriteria, Criteria } from './../../gird.models';

@Component({
  selector: 'gird-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  constructor() { }

  isFilterApplied: boolean = false;

  DateDataType = ColDataType.Date;
  StringDataType = ColDataType.String;
  NumberDataType = ColDataType.Number;
  BoolDataType = ColDataType.Bool;
  AnchorDataType = ColDataType.Anchor;
  PopupDataType = ColDataType.Popup;
  ButtonDataType = ColDataType.Button;
  
  private _filterId: string;
  @Input('filter-id') set filterId(arg: string){
    this._filterId = arg;
  }
  
  get filterId() : string {
     if(this._filterId){
       return this._filterId;
     }
    return "filter"
  }

   

  selectedFilteredColumnsMap: Map<string,any> = new Map();
  sfcKeys: string[] = [];

  preparedFilteredColumnsMap: Map<string, any> = new Map();

  currentFilterColumnTitle: string;
  currentFilterDataProperty: string;
  currentFilterColumnDataType: ColDataType;
  currentFilterOption: string = 'select';
  currentSelectParameters: Map<any, any> = new Map();
  currentFilterCriteria: string = 'Contains';

  private _currentFilterCriteriaValue: any;
  set currentFilterCriteriaValue(arg: any){
    this._currentFilterCriteriaValue = arg;
    if(!this.selectedFilteredColumnsMap.has(this.currentFilterDataProperty) && arg){
      this.selectedFilteredColumnsMap.set(this.currentFilterDataProperty, this.currentFilterColumnTitle);
      this.sfcKeys = Array.from(this.selectedFilteredColumnsMap.keys());
    }else if(!arg && this.currentSelectParameters.size == 0){
     this.selectedFilteredColumnsMap.delete(this.currentFilterDataProperty); 
     this.sfcKeys = Array.from(this.selectedFilteredColumnsMap.keys());
    }
  }

  get currentFilterCriteriaValue(){
    return this._currentFilterCriteriaValue;
  }

  uniqueCurrentColValues: any[];

  showFilter: boolean = false;
  onFilterTogleHandler(event){
    this.showFilter = !this.showFilter;
  }

  @Output('on-unique-val-req') onUniqeValuesRequestEvent = new EventEmitter<string>();
  @Output('on-filter-criteria-change') onFilterCriteriaChangeEvent = new EventEmitter<any[]>();
  @Output('on-clear-all-filters') onClearAllFiltersEvent = new EventEmitter();
  
  uniqueColumnValues: any[];
  private _requestedUniqueValues: any[] = [];
  @Input('requested-uniq-vals') set requestedUniqueValues(args:any[]){
    this._requestedUniqueValues = args;
    this.uniqueColumnValues = args;
  }

  get requestedUniqueValues(){
    return this._requestedUniqueValues;
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

  ngOnInit() {
    
  }

  onSelectedColumnChangeHandler(event){
    const targetDataProperty = event.target.value;

    if(this.currentFilterDataProperty 
        && this.selectedFilteredColumnsMap.has(targetDataProperty)
        && this.currentFilterOption == 'select'){

      let fl = {
        dataProperty: this.currentFilterDataProperty,
        filterBy: this.currentFilterOption,
        params: this.currentSelectParameters,
        title: this.currentFilterColumnTitle
      }
      
      this.preparedFilteredColumnsMap.set(targetDataProperty, fl);

    }else if(this.currentFilterDataProperty && this.selectedFilteredColumnsMap.has(targetDataProperty)){
      let u = {
        dataProperty: this.currentFilterDataProperty,
        filterBy: this.currentFilterOption,
        title: this.currentFilterColumnTitle,
        criteria: this.currentFilterCriteria,
        criVal: this.currentFilterCriteriaValue
      }
      
      this.preparedFilteredColumnsMap.set(targetDataProperty, u);
    }

    let col = this.columns.find(f => f.dataProperty == targetDataProperty);
    this.currentFilterColumnTitle = col.title;
    this.onUniqeValuesRequestEvent.emit(col.dataProperty);
    
    this.currentFilterColumnDataType = col.dataType;

  }
  
  showFilterPopupModel(event){
    //this.uniqueColumnValues = [];
    //this.uniqueColumnValues = this._requestedUniqueValues;
  }

  onFilterOptionChange(option){
    this.currentFilterOption = option;
  }

    
  onSelectValueCheckHandler(value){

    if(this.currentSelectParameters.has(value)){
      this.currentSelectParameters.delete(value);
    }else{
      this.currentSelectParameters.set(value, value);
    }

    if(!this.selectedFilteredColumnsMap.has(this.currentFilterDataProperty)){
      this.selectedFilteredColumnsMap.set(this.currentFilterDataProperty, this.currentFilterColumnTitle);
      this.sfcKeys = Array.from(this.selectedFilteredColumnsMap.keys());
    }else if(this.currentSelectParameters.size == 0 && !this.currentFilterCriteria){
      this.selectedFilteredColumnsMap.delete(this.currentFilterDataProperty);
      this.sfcKeys = Array.from(this.selectedFilteredColumnsMap.keys());
    }
  }

  filterCriteriaSelectHandler(event){    
    

  }



  removeColumnFromFilters(dataProperty){
    console.log(`removing ${dataProperty} from filtered map`);
    this.selectedFilteredColumnsMap.delete(dataProperty);
    this.sfcKeys = Array.from(this.selectedFilteredColumnsMap.keys());
    this.preparedFilteredColumnsMap.delete(dataProperty);

  }

  onApplyFilterColumnHandler(event){

    /* select filter */
    if(this.currentFilterDataProperty 
      && !this.preparedFilteredColumnsMap.has(this.currentFilterDataProperty) 
      && this.selectedFilteredColumnsMap.has(this.currentFilterDataProperty)
      && this.currentFilterOption == 'select' 
    ){

    let fl = {
      dataProperty: this.currentFilterDataProperty,
      filterBy: this.currentFilterOption,
      params: this.currentSelectParameters,
      title: this.currentFilterColumnTitle
    }
    
    this.preparedFilteredColumnsMap.set(this.currentFilterDataProperty, fl);

  }else if(
    this.currentFilterDataProperty 
    && !this.preparedFilteredColumnsMap.has(this.currentFilterDataProperty) 
    && this.selectedFilteredColumnsMap.has(this.currentFilterDataProperty)
    ){
    let u = {
      dataProperty: this.currentFilterDataProperty,
      filterBy: this.currentFilterOption,
      title: this.currentFilterColumnTitle,
      criteria: this.currentFilterCriteria,
      criVal: this.currentFilterCriteriaValue
    }
    
    this.preparedFilteredColumnsMap.set(this.currentFilterDataProperty, u);
  }

    if(this.preparedFilteredColumnsMap.size > 0){
      this.onFilterCriteriaChangeEvent.emit(Array.from(this.preparedFilteredColumnsMap.values()));
      this.isFilterApplied = true;
    }
    
  }

  clearAllFilterHandler(event){    
    this.currentSelectParameters.clear();
    this.currentFilterCriteriaValue = null;
    this.currentFilterCriteria = '=';
    this.onClearAllFiltersEvent.emit();
    this.selectedFilteredColumnsMap.clear();
    this.sfcKeys = [];
    this.preparedFilteredColumnsMap.clear();
    this.isFilterApplied = false;
    this.uniqueColumnValues = [];
  }
  



}
