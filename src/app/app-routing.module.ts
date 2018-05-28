import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';


export const routes: Routes = [
  { path: '', component: SummaryComponent},
  { path: 'detail/:id', component: DetailComponent},
  { path: 'add', component: AddComponent}
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}