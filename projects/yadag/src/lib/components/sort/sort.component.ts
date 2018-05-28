import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gird-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit {

  isSorted: boolean = false;  
  sortByState: string;

  sortColumns: any[] = [];  

  @Input('source-columns') set sourceColumns(args: any[]){    
    this.sortColumns.splice(0);
    args.forEach(col => {
      let sortCol = {
        title: col.title,
        dataProperty: col.dataProperty,
        visible: col.visible,
        sorted: false,
        sortDir: 'ASC',
        sortOrder: 1000
      };

      this.sortColumns.push(sortCol);
    });
  
  }
  

  private _sourceData: any[];
  @Input('source-data') set sourceData(args: any[]){
    this._sourceData = args;
    
  };

  get sourceData(){
    return this._sourceData;
  }

  @Output('onDataSorted') sortDataEmitter = new EventEmitter<SortResult>();

  private _sortedData: any[];

  get sortedData(){
    if(this.isSorted){
      return this._sortedData;
    }
    return this.sourceData;
  }

  set sortedData(args: any[]){
    
    this._sortedData = args;
    this.isSorted = true;
    let sr = new SortResult(args, true, this.sortByState);
    
    this.sortDataEmitter.emit(sr);
  }

  constructor() { }

  ngOnInit() {

  }

  removeSortHandler(){
    this.isSorted = false;
    let sr = new SortResult(this.sourceData, false, '');    
    this.sortDataEmitter.emit(sr);
  }
  
  selectedSortByArray: SortByCol[] = [];

  removeSortByHandler(dataProperty){
    
    let f = this.selectedSortByArray.findIndex(f => f.dataProperty == dataProperty);
    for(let a =f+1; a < this.selectedSortByArray.length; a++){
      this.selectedSortByArray[a].sortOrder--;
    }
    this.selectedSortByArray.splice(f, 1);
    
  }
  
  //sortColTargetId: string = 'col-1';
  sortColSelectHandler(event){
    
    let targetCol = this.selectedSortByArray[event.target.id];
    targetCol.title = event.target.selectedOptions[0].text;
    targetCol.dataProperty = event.target.value;
  }

  sortColOrderHandler(event){    
    
    let selectedCol = this.selectedSortByArray[event.target.id]
    selectedCol.sortDir = event.target.value == 'ASC'?SortDir.ASC:SortDir.DESC;

    let sortCol = this.sortColumns.find(f => f.dataProperty == selectedCol.dataProperty);
    sortCol.sorted = true;
    selectedCol.title = sortCol.title;
    
    
  }

  addSortByHandler(){
    let availableColumns = this.sortColumns.map(m => m);
    this.selectedSortByArray.forEach(sc => {
      let f = availableColumns.findIndex(f => f.dataProperty == sc.dataProperty);
      if(f != -1){
        availableColumns.splice(f, 1);
      }
    });

    if(availableColumns.length == 0){
      return;
    }
    
    let tempCol = new SortByCol();          
    tempCol.sortOrder= this.selectedSortByArray.length + 1;
    tempCol.availableCols = availableColumns;
    tempCol.sortDir = SortDir.ASC;
    tempCol.title = availableColumns[0].title;
    tempCol.dataProperty = availableColumns[0].dataProperty;
    this.selectedSortByArray.push(tempCol);
  }

  onSortHandler(e){

    this.sortByState = this.selectedSortByArray.map(s => `${s.title} - ${s.sortDir==SortDir.ASC?'⇊':'⇈'}`).join(', ');
    
    this.sortData(this.selectedSortByArray);
    
  }

  private sortData(sortBy:SortByCol[]){
    //create a copy of original un-sorted data.
    let sortedRows = this.sourceData.map(r => r);

    if(sortBy.length == 1){
      let p = sortBy[0].dataProperty;
      let o = sortBy[0].sortDir;

      this.sortedData = sortedRows.sort((a, b)=>{
        let sr = this.compareAsc(a[p], b[p]);
        if(o == SortDir.DESC){
          return sr * -1;
        }
        return sr;
      });
      return;
    }
    else{
      for(let i = 0; i < sortBy.length - 1; i++){
        sortedRows = this.sortByProps(
          sortedRows,
          sortBy[i].dataProperty,
          sortBy[i].sortDir,
          sortBy[i+1].dataProperty,
          sortBy[i+1].sortDir
        );
      }
    }

    this.sortedData = sortedRows;
  }

  private sortByProps(data, p1, p1Dir, p2, p2Dir){
    return data.sort((a, b)=>{
      return this.compareObjects2(a, b, p1, p1Dir, p2, p2Dir);
    });
  }

 
  //p1 is higher priority
  private compareObjects2(a, b, p1, p1Dir, p2, p2Dir){

    let p1Result = this.compareAsc(a[p1], b[p1]);
    if(p1Dir == SortDir.DESC){
      p1Result = p1Result * -1;
    }

    if(p1Result != 0){
      return p1Result;
    }

    //p1 is equal, sort p2
    let p2Result = this.compareAsc(a[p2], b[p2]);

    if(p2Dir == SortDir.DESC){
      return p2Result * -1;
    }

    return p2Result;

  }

  private compareAsc(v1, v2){
    if(!v2){
      return 1;
    }

    if(!v1){
      return -1;
    }

    if(typeof v1 === 'string'){
      v1 = v1.toLowerCase();
      v2 = v2.toLowerCase();
    }
    if(v1 < v2){
      return -1;
    }

    if(v1 > v2){
      return 1;
    }

    return 0;
  }


}

export class SortByCol{
  title: string;
  dataProperty: string;
  sortDir: SortDir;
  sortOrder: number;
  availableCols: any[];
}

export enum SortDir{
  ASC,
  DESC
}

export class SortResult{
  data: any[];
  isSorted: boolean;
  sortByState: string;
  constructor(data: any[],
    isSorted: boolean,
    sortByState: string){

      this.data = data;
      this.isSorted = isSorted;
      this.sortByState = sortByState;

  }
    

  
}