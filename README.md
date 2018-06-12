# YADAG - Yet Another Dynamic Angular Gird
### A featur-rich dynamic gird for Angular with following features:
* Advanced Filter/search
* Quick Search box
* Advance multi-column sort
* Column show/hide
* Popups in cells for larger values
* Vertical Columns Headings
* Anchor Links, Symbols and buttons in cells
* CSV download of filtered and sorted data
* Paging
* Column width control with min and max width
* Use your own Bootstrap V4 styles for the table
* Gird Heading
* Show hide toolbar buttons
* Dynamic summary row in footer, by default it shows the count of distinct values of the corresponding column
* Custom aggregation function supported

**[Click here to see the live demo](https://yadag-demo.effordea.com/)**

### Installation:
    npm i yadag
### Dependencies:
* [Bootstrap v4](https://www.npmjs.com/package/bootstrap)
* [JQuery](https://www.npmjs.com/package/jquery)
* [Moment](https://www.npmjs.com/package/moment)
* [ngx-bootstrap](https://www.npmjs.com/package/ngx-bootstrap)
* [ngx-papaparse](https://www.npmjs.com/package/ngx-papaparse)
* [papaparse](https://www.npmjs.com/package/papaparse)
* [popper.js](https://www.npmjs.com/package/popper.js)

### Important Style Notes:
1. Some style code is not added in the package, hence neither it is shipped with npm package nor is installted through dependencies. This is a know issue, and will be fixed in up coming versions. **For a quick work around, just copy paste css, fonts, and webfonts directories from the *./src/asset* directory of this repository.**
2. Once the styles directories are placed in */src/assets* directory, mention them in *angular.json/angular-cli.json* of your project as following:


        "styles": [
            "./node_modules/bootstrap/dist/css/bootstrap.min.css",
            "./src/assets/css/custom-font-awesome.min.css",
            "src/styles.css"
        ],
        "scripts": [
            "./node_modules/jquery/dist/jquery.min.js",
            "./node_modules/popper.js/dist/umd/popper.min.js",
            "./node_modules/bootstrap/dist/js/bootstrap.min.js"      
        ]
3. Assuming that you are already using Bootstrap V4, as already mentioned above in dependencies. If not, just copy paste the following line in your *style.css* file:


        @import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

### Usage:
1. Import `YadagModule` module in your feature/app module add in `imports` array as following


        ...
        import { YadagModule } from 'yadag';
        ...
        imports: [
            ...
            YadagModule
         ],
        ...
2. Add and configure `dynamic-gird` component into your target component's `.html` as following:


        <dynamic-gird gird-heading="Users Summary" 
            [gird-columns]="fields" [gird-rows]="data"
            [table-css-classes]="'table table-striped table-bordered table-sm bg-white'"
            rows-per-page="15" enable-paging="true" 
            (on-btn-column-click)="onColumnClickHandler($event)"
            (on-add-btn-click)="addButtnClickHandler($event)"
            [row-tracking-id]="'id'">
        </dynamic-gird>
  
3. Definition of the attributes:
3.1 `gird-heading` a string to be displayed as the gird heading
3.2 `gird-columns` an array of column objects
3.3 `gird-rows` an array of row objects
3.4 `table-css-classes` style class to be applied over the gird table 
3.5 `rows-per-page` the number of rows to be displayed per page
3.6 `enable-paging` pager enable/disable flag
3.7 `on-btn-column-click` the event handler that would be called on the click event of any button embedded in any cell.
3.8 `on-add-btn-click` the event handler that would be called on the click event of the **add +** button
3.9 `row-tracking-id` a unique value to uniquely identify the row

### Column Object Structure:
    {
          title: "Id", //column heading
          dataProperty: "id", //the data property to be used as the value in the cell
          visible: true, //column visible/invisible flag
          dataType: ColDataType.Anchor, //the data type of the column
          maxWidth: '50px', //maximum width of the column
          minWidth: '30px', //minimum width of the column
          isVertical: false //if set to true, the column heading will be vertically oriented. Useful for a large number of columns.
    }

### Column Data Types:


    enum ColDataType{
      Number, //for numerical values
      String, //for text values
      Date, //for date values
      Bool, //for boolean values
      Anchor, //for anchor links
      Popup, //for popups
      Button //for button columns
    }

### Row Object Structure:


    let row = {
        id:  23,
        firstName: 'Nadeem',
        lastName: 'Jamali',
        email: 'nadeem.jamali@org.com',
        dob: new Date('1995-05-07'),
        active: true,
        task1Status: 2,
        anchors: new Map<string, any>(), //required for popups, buttons and anchors configuration
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
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

          //setting up delete button column
      row.anchors.set('delete',{ // delete is the column in which the button will be displayed
        fontClasses: 'fas fa-trash text-danger', //the button is font-awesome icon
        param: { //to be passed with the event
          id: row.id
        }
      });


### Column-Button click handler:

    
        onColumnClickHandler(eventData){
            if(eventData.dataProperty != 'delete'){
              return;
            }
            console.log(`adding to hidden: ${eventData.id}`);
        }

### Add Button Click Handler:


          addButtnClickHandler(event){
            //navigate to your add-new-item screen
            this.router.navigateByUrl('/add');
          }

### Custom Aggregation Function:
Set custom aggregation function in the column object like following example:

    {
      title: "Active",
      dataProperty: "active",
      visible: false,
      dataType: ColDataType.Bool,
      maxWidth: '30px',
      aggregateFunc: (map: Map<string, number>, dataProperty: string, row: any) => {
            const colVal = row[dataProperty];
            if(colVal){
                map.set(`${map.size}`, 1);
            }
        }
    }

The function in the above example counts the truthy values of the corresponding cell i.e 'Active'. While aggregating, for now the size of the map is used as the value of the footer cell.

### Handling Report Data Ready Event:
When the report data is ready to be shown in the gird, `on-report-data-ready` is triggered. Which provides the report data. The event is triggered in the result of following events:

1. On getting the source data
2. On filter event
3. On sort event

To handle the event, place `(on-report-data-ready)="reportDataReadyHandler($event)"` in your `.html` file, and define `reportDataReadyHandler(reportRows: any[]){...}` in your `.ts` file.

## Please use issues section for any issues submission or submit pull requests.

**Licence: MIT**