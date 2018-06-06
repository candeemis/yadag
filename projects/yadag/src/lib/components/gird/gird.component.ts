import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import moment from 'moment';

import { Column, ColDataType } from './../../gird.models';
import { PageComponent } from '../page/page.component';
import { SortResult, SortComponent } from '../sort/sort.component';

@Component({
  selector: 'dynamic-gird',
  templateUrl: './gird.component.html',
  styleUrls: ['./gird.component.css']
})
export class GirdComponent {


  @Input('gird-heading') heading: string;
  @Input('table-css-classes') tableCSS: string;
  @Input('rows-per-page') rowsPerPage: number = 25;
  @Input('enable-paging') enablePaging: boolean;
  @Input('csv-file-name') csvFileName: string = 'summary';
  @Input('gird-id') girdId: string;

  @Input('row-tracking-id') trackerId: string;

  @Input('show-add-button') showAddButton = true;
  @Input('show-download-button') showDownload = true;
  @Input('show-sort-button') showSorting = true;
  @Input('show-quick-search') showQuickSearch = true;

  @Output('on-add-btn-click') onAddClickEmitter = new EventEmitter();

  onAddBtnClickHandler = () => {
    this.onAddClickEmitter.emit('');
  }

  @ViewChild(PageComponent)
  public pager: PageComponent;

  @ViewChild(SortComponent)
  public sorter: SortComponent;

  isSorted: boolean = false;
  sortByState: string;

  isFiltered: boolean = false;
  private _filterByState: string[] = [];
  get filterByState() {
    return this._filterByState.join(' AND ');
  }
  set filterByState(arg: string) {
    this._filterByState.push(arg);
  }

  summaryRow = {
    cols: [],
    valuesMap: new Map<string, string>()
  };

  summaryColMap: Map<string, Map<string, number>>;
  columnsCount: number = 0;
  /**
   * Data columns
   */
  private _columns: Column[];
  @Input('gird-columns') get columns() {
    return this._columns;
  }
  set columns(args: Column[]) {
    this._columns = args;
    this.columnsCount = this._columns.length;

    // initialize column map for summary row
    this.summaryColMap = new Map<string, Map<string, number>>();
    args.forEach(col => {
      // if (col.dataType === ColDataType.Button) {
      //   return;
      // }
      this.summaryColMap.set(col.dataProperty, new Map<string, number>());
    });
    
  }

  rowsCount: number = 0;

  private _rows: any[] = [];
  @Input('gird-rows') get rows() {
    return this._rows.map(m => m);
  }
  set rows(args: any[]) {
    this._rows.splice(0);
    args.map(m => this._rows.push(m));
    this.reportData = this.rows;
  }

  private _reportData: any[] = [];

  get reportData() {
    return this._reportData;
  }

  set reportData(args: any[]) {

    if (!this.enablePaging && args.length > 0){
      this.rowsPerPage = args.length;
    } else if (!this.enablePaging && args.length == 0) {
      this.rowsPerPage = 10;
    }

    let currentCount = this.reportData.length;
    let newCount = args.length;
    if (currentCount == newCount) {
      this.pager.currentPageNumber = 1;
    }

    this._reportData.splice(0);
    args.map(m => this._reportData.push(m));
    this.rowsCount = args.length;


    if (!this.enablePaging && args.length > 0){
      this.reportRows.splice(0);
      this.reportRows.push(...this.reportData);
    } else if (!this.enablePaging && args.length == 0) {
      this.reportRows.splice(0);
    }
    this.calculateSummary();
  }

  constructor(private papa: PapaParseService) { }

  calculateSummary() {

    this.summaryColMap.forEach((map, key) => map.clear());
    this.summaryRow.valuesMap = new Map<string, string>();
    this.reportData.forEach(row => {

      this.summaryColMap.forEach((map, col) => {
        this.countUniqueValues(map, col, row);
      });

    });

    this.summaryColMap.forEach((map, key) => {
      this.summaryRow.valuesMap.set(key, `${map.size}`);
    });
    this.summaryRow.cols = this.columns.filter(f => f.visible)
      .map(col => col.dataProperty);
  }

  private countUniqueValues(map, col, row){
    if(!map.has(row[col])){
      map.set(row[col], 1);
    }
  }

  _sortedData: any[] = [];
  get sortedData() {
    return this._sortedData.map(m => m);
  }

  set sortedData(args: any[]) {
    this._sortedData.splice(0);
    args.map(m => this._sortedData.push(m));

    this.reportData = args;
    this.pager.forcePageRefresh();
  }

  _filteredData: any[] = [];
  get filteredData() {
    return this._filteredData.map(m => m);
  }

  set filteredData(args: any[]) {
    this._filteredData.splice(0);
    args.forEach(f => this._filteredData.push(f));

    this.reportData = this.filteredData;
  }

  reportRows: any[] = [];

  onDataSortHandler(sortResult: SortResult) {
    if (sortResult.isSorted) {
      this.sortedData = sortResult.data;
      this.sortByState = sortResult.sortByState;
    }
    this.isSorted = sortResult.isSorted;

  }

  reportDataBeforeQuickSearch: any[];
  isQuickSearched = false;

  onQuickSearchChangeHandler(event) {

    let quickCriteria = event.target.value.trim().toLowerCase();
    if (!quickCriteria) {
      this.reportData = this.rows;
      return;
    }


    let quickResult = this.rows.filter(row => Object.keys(row).some(key => row[key] ? row[key].toString().toLowerCase().includes(quickCriteria) : false));

    this.reportData = quickResult;
  }



  onPageChangeHandler(slot: number[]) {
    if (this.enablePaging) {
      this.reportRows.splice(0);
      this.reportRows.push(...this.reportData.slice(slot[0], slot[1]));
    }

  }

  requestedUniqueValues: any[];

  onUniqueValueRequestHandler(dataProperty) {
    let map = new Map();
    this.reportData.map(row => {
      if (!map.has(row[dataProperty])) {
        map.set(row[dataProperty], row);
      }
    });

    this.requestedUniqueValues = Array.from(map.keys());
  }

  @Output('on-btn-column-click') onColumnClickEvent = new EventEmitter<any>();

  onColumnClickHandler(eventData) {
    this.onColumnClickEvent.emit(eventData);
  }

  onClearAllFilters() {

    this.isFiltered = false;
    this._filterByState.splice(0);

    this.reportData = this.rows;

  }

  appendFilterCriteria(criteria: any[]) {

    let sourceData = this.rows;

    let filterByState = [];

    criteria.forEach(filter => {
      if (filter.filterBy == 'select'){
        let filteredData = [];
        sourceData.map(row => {
          if (filter.params.has(row[filter.dataProperty])){
            filteredData.push(row);
          }
        });
        sourceData = filteredData;
        filterByState.push(` ${filter.title} in (...) `);
      } else {
        let filteredData = [];
        sourceData.map(row => {
          if (this.filterIt[filter.criteria](row[filter.dataProperty], filter.criVal)) {
            filteredData.push(row);
          }
        });
        sourceData = filteredData;
        filterByState.push(` ${filter.title} ${filter.criteria} ${filter.criVal} `);
      }
    });

    this.filterByState = filterByState.join('➙');

    this.filteredData = sourceData;
    this.isFiltered = true;

  }

  private filterIt = {
    "=": (x, y) => {
      return x == y;
    },
    "!=": (x, y) => {
      return x != y;
    },
    ">=": (x, y) => {
      return x >= y;
    },
    "<=": (x, y) => {
      return x <= y;
    },
    '>': (x, y) => {
      return x > y;
    },
    "<": (x, y) => {
      return x < y;
    },
    "Contains": (x: string, y: string) => {
      if (!x || !y) return false;
      return x.toLowerCase().includes(y.toLowerCase());
    },
    "DoesNotContain": (x: string, y: string) => {
      if (!x || !y) return false;
      return !x.toLowerCase().includes(y.toLowerCase());
    },
    "startsWith": (x: string, y: string) => {
      if (!x || !y) return false;
      return x.toLowerCase().startsWith(y.toLowerCase());
    },
    "doesNotStartWith": (x: string, y: string) => {
      if (!x || !y) return false;
      return !x.toLowerCase().startsWith(y.toLowerCase());
    },
    "endsWith": (x: string, y: string) => {
      if (!x || !y) return false;
      return x.toLowerCase().endsWith(y.toLowerCase());
    },
    "doesNotEndWith": (x: string, y: string) => {
      if (!x || !y) return false;
      return !x.toLowerCase().endsWith(y.toLowerCase());
    },
    "true": (x: boolean, y) => {
      return x == true;
    },
    "false": (x: boolean, y) => {
      return x == false;
    },
    "beforeThan": (x: Date, y: Date) => {
      return x < y;
    },
    "afterThan": (x: Date, y: Date) => {
      return x > y;
    }
  }

  exportCSVClickHandler() {

    let keys = [];
    const csvColumns = [];
    this.columns.forEach(c => {
      if (c.visible && c.dataType != ColDataType.Button) {
        keys.push({key: c.dataProperty, dtype: c.dataType});
        csvColumns.push(c.title);
      }
    });

    // const jsonData = JSON.stringify(this.reportData);


    const jsonData = this.reportData.map(row => {
      return keys.map(kp => {
        if (kp.dtype == ColDataType.Date) {
          return moment(row[kp.key]).format('ll');
        }
        return row[kp.key];
      });
    });

    let titleRow = `${this.heading}\r\n`;

    try {
      let result = this.papa.unparse({
        data: jsonData, fields: csvColumns,
        config: {
          quotes: true,
          quoteChar: '"',
          delimiter: ",",
          header: false,
          newline: "\r\n"
        }
      });


      //download file
      let encodedUri = encodeURI("data:text/csv;charset=utf-8," + titleRow + result);
      let link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${this.csvFileName}.csv`);
      document.body.appendChild(link); // Required for FF

    link.click();
    } catch (err) {
      console.error(err);
    }
  }

}

