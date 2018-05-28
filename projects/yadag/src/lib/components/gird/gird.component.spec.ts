import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed,inject } from '@angular/core/testing';
import { FormsModule} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { GirdComponent } from './gird.component';
import { TableComponent } from './../../mocks/table.component';
import { HideDirective } from './../../directives/hide.directive';
import { PageComponent } from './../../mocks/page.component';
import { Column, ColDataType } from '../../gird.models';



@Component({
  selector: `host-component`,
  template: `<dynamic-gird id='dyn-gird'></dynamic-gird>`
})
class TestHostComponent{
  @ViewChild(GirdComponent)
  public girdComponent: GirdComponent;

  

  testColumns:Column[] = [
    {
      title: "Id",
      dataProperty: "id",
      visible: true,
      dataType: ColDataType.Number,
      isVertical: false,
      maxWidth: '100px',
      minWidth: '20px'
    },
    {
      title: "First Name",
      dataProperty: "firstName",
      visible: true,
      dataType: ColDataType.String,
      isVertical: false,
      maxWidth: '100px',
      minWidth: '20px'
    },
    {
      title: "Last Name",
      dataProperty: "lastName",
      visible: true,
      dataType: ColDataType.String,
      isVertical: false,
      maxWidth: '100px',
      minWidth: '20px'
    }
  ];

  get testRows(){
    const users = [
      {
        "id": "7173",
        "first_name": "Aaron",
        "last_name": "Murillo"
      },
      {
        "id": "8507",
        "first_name": "Soma",
        "last_name": "Splaver"
      },
      {
        "id": "8730",
        "first_name": "Dave",
        "last_name": "Blackledge"
      }
    ]

    return users.map(u => {
      return {
        id:  Number.parseInt(u.id),
        firstName: u.first_name,
        lastName: u.last_name
        
      };

    });
  }
  


}

describe('GirdComponent', () => {
  let hostComponent: TestHostComponent;
  let girdComponent: GirdComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule],
      declarations: [TestHostComponent, GirdComponent, TableComponent, PageComponent, HideDirective ],
      providers:[PageComponent],
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    girdComponent = hostComponent.girdComponent;
  });

  it('should create the component.', () => {
      expect(hostComponent).toBeTruthy();    
  });

  it('should update columns.', ()=>{

    try {
      expect(girdComponent.columnsCount).toBe(0);
      girdComponent.columns = hostComponent.testColumns;
      expect(girdComponent.columnsCount).toBe(3);  
    } catch (error) {
      fail(error);
    }
    

  });

  it('should update rows.', ()=>{

    try {
      expect(girdComponent.rowsCount).toBe(0);
      girdComponent.rows = hostComponent.testRows;
      expect(girdComponent.rowsCount).toBe(3);  
    } catch (error) {
      fail(error);
    }
  });

  it('should handle page change event', ()=>{

    girdComponent.rows = hostComponent.testRows;
    girdComponent.onPageChangeHandler([0, 2]);
    
    expect(girdComponent.reportRows.length).toBe(2);
    expect(girdComponent.reportRows[0]).toBe(girdComponent.rows[0]);
    expect(girdComponent.reportRows[1]).toBe(girdComponent.rows[1]);
  });

 
});
