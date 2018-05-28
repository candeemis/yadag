import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PapaParseModule } from 'ngx-papaparse';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { GirdComponent } from './components/gird/gird.component';
import { TableComponent } from './components/table/table.component';
import { PageComponent } from './components/page/page.component';
import { SortComponent } from './components/sort/sort.component';
import { FilterComponent } from './components/filter/filter.component';
import { ColPopupComponent } from './components/col-popup/col-popup.component';

import { HideDirective } from './directives/hide.directive';
import {ModFilterPipe} from './pipes/mode-filter.pipe';

import {PageComponent as PageComponentMock} from './mocks/page.component';
import {TableComponent as TableComponentMock} from './mocks/table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PapaParseModule,
    RouterModule,
    PopoverModule.forRoot()
  ],
  exports:[GirdComponent, ModFilterPipe],
  declarations: [
    GirdComponent,
    TableComponent,
    HideDirective,
    PageComponent,
    SortComponent,
    FilterComponent,
    ModFilterPipe,
    PageComponentMock,
    TableComponentMock,
    ColPopupComponent
  ]
})
export class YadagModule { }
