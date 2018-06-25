import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {IndexContentComponent} from "./index-content/index-content.component";
import {MainComponent} from "./main/main.component";

const routes: Routes = [
  { path: 'index', component: IndexContentComponent  },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
