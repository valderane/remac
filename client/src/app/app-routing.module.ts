import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {IndexContentComponent} from "./index-content/index-content.component";
import {MainComponent} from "./main/main.component";
import { AuthGuardService } from './shared/auth-guard.service';
import { ProfilComponent } from './profil/profil.component';
import { MonProfilComponent } from './mon-profil/mon-profil.component';

const routes: Routes = [
  { path: 'index', component: IndexContentComponent  },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'profil/:id', component: ProfilComponent },
  { path: 'mon_profil', component: MonProfilComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [AuthGuardService]
})
export class AppRoutingModule {}
