export interface Column{
    title: string;
    dataProperty: string;
    visible: boolean;
    dataType: ColDataType;
    isVertical:boolean;    
    minWidth:string;
    maxWidth:string;
  }

export enum ColDataType{
  Number,
  String,
  Date,
  Bool,
  Anchor,
  Popup,
  Button
}

export class FilterCriteria{
  dataProperty: string
}


export enum Criteria{
  Contains,
  DoesNotContain,
  EqualsTo,
  DoesNotEqualTo,
  GreaterThan,
  GreaterOrEqualTo,
  LessThan,
  LessOrEqualTo,
  AfterThan,
  AfterOrEqualTo,
  BeforeThan,
  BeforeOrEqualTo,
  true,
  false,
  between
}
