import { Component, OnInit } from '@angular/core';
import users from './users';
import { ColDataType } from 'yadag';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  fields = [
    {
      title: "Id",
      dataProperty: "id",
      visible: true,
      dataType: ColDataType.Anchor,
      maxWidth: '50px'
    },
    {
      title: "First Name",
      dataProperty: "firstName",
      visible: true,
      dataType: ColDataType.String
    },
    {
      title: "Last Name",
      dataProperty: "lastName",
      visible: true,
      dataType: ColDataType.String
    },
    {
      title: "Email",
      dataProperty: "email",
      visible: true,
      dataType: ColDataType.String,
      minWidth: '100px'
    },
    {
      title: "Date of Birth",
      dataProperty: "dob",
      visible: true,
      dataType: ColDataType.Date,
      maxWidth: '100px'
    },
    {
      title: "Active",
      dataProperty: "active",
      visible: false,
      dataType: ColDataType.Bool,
      maxWidth: '30px',
      aggregateFunc: this.countActives
    },
    {
      title: "Message",
      dataProperty: "message",
      visible: true,
      dataType: ColDataType.Popup,
      maxWidth: '150px'
    },
    {
      title: "Delete",
      dataProperty: "delete",
      visible: true,
      dataType: ColDataType.Button,
      maxWidth: '30px'
    },
    
    {
      title: "Task 1 Status",
      dataProperty: "task1Status",
      visible: true,
      dataType: ColDataType.Popup,
      isVertical: true,
      maxWidth: '50px'
    }
    ,
    {
      title: "Task 2 Status",
      dataProperty: "task2Status",
      visible: true,
      dataType: ColDataType.Popup,
      isVertical: true,
      maxWidth: '50px'
    }
    ,
    {
      title: "Task 3 Status",
      dataProperty: "task3Status",
      visible: true,
      dataType: ColDataType.Popup,
      isVertical: true,
      maxWidth: '50px'
    }
    
  ];
  
  data: any[];
  hiddinRows: Map<number, any>;

  constructor(private router: Router){

  }

  ngOnInit() {
    this.hiddinRows = new Map<number, any>();
    this.populateData();
  }

  private populateData(){
    this.data = [];
    console.log(`size of hidden: ${this.hiddinRows.size}`);

    for(let i = 0; i < users.length; i++){
      let u = users[i];
      let id = Number.parseInt(u.id);

      if(this.hiddinRows.has(id)){
        console.log(`skipping ${id}`);
        continue;
      }

      let row = {
        id:  id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        dob: new Date(u.dob),
        active: u.active === "1",
        message: u.message,
        task1Status: u.task_1_status,
        task2Status: u.task_2_status,
        task3Status: u.task_3_status,
        anchors: new Map()
      };

      //setting up anchor with popup type column
      row.anchors.set('id', {
        url: `/detail/${row.id}`,
        text: row.id,
        title: row.id,
        display: 'anchor'
      });

      //setting up plain popup type column
      row.anchors.set('message', {
        text: row.message,
        title: 'Message',
        display: 'plain'
      });

      //setting up delete button column
      row.anchors.set('delete',{
        fontClasses: 'fas fa-trash text-danger',
        param: {
          id: row.id
        }
      });

      
      //setting up symbol with popup column
      let task1Class = row.task1Status===1?'fas fa-check text-success':'fas fa-tasks text-primary';
      row.anchors.set('task1Status', {
        dataType: ColDataType.Popup,
        text: row.task1Status,
        title: 'Task 1 Status',
        display: 'symbol',
        hasValue: true,
        fontClasses: task1Class
      });

      let task2Class = row.task2Status===1?'fas fa-check text-success':'fas fa-tasks text-primary';
      //setting up symbol with popup column
      row.anchors.set('task2Status', {
        dataType: ColDataType.Popup,
        text: row.task2Status,
        title: 'Task 2 Status',
        display: 'symbol',
        hasValue: true,
        fontClasses: task2Class
      });

      let task3Class = row.task3Status===1?'fas fa-check text-success':'fas fa-tasks text-primary';
      //setting up symbol with popup column
      row.anchors.set('task3Status', {
        dataType: ColDataType.Popup,
        text: row.task3Status,
        title: 'Task 3 Status',
        display: 'symbol',
        hasValue: true,
        fontClasses: task3Class
      });

      this.data.push(row);
    };

  }

  countActives(map: Map<string, number>, col: string, row: any):void {
    const colVal = row[col];
    if(colVal){
      map.set(`${map.size}`, 1);
    }
  }

  onColumnClickHandler(eventData){
    if(eventData.dataProperty != 'delete'){
      return;
    }

    // the object is being made invisible here, in real life execute your delete/remove logic properly.
    this.hiddinRows.set(eventData.id, '');
    console.log(`adding to hidden: ${eventData.id}`);
    this.populateData();
  }

  reportDataReadyHandler(reportRows: any[]){
    console.log(`got ${reportRows.length} rows in report data ready event.`);
  }

  addButtnClickHandler(event){
    this.router.navigateByUrl('/add');
  }


}
