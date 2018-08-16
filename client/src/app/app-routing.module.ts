import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {IndexContentComponent} from "./index-content/index-content.component";
import {MainComponent} from "./main/main.component";
import { AuthGuardService } from './shared/auth-guard.service';
import { ProfilComponent } from './profil/profil.component';
import { MonProfilComponent } from './mon-profil/mon-profil.component';
import { AjoutDomainComponent } from './ajout-domain/ajout-domain.component';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { IndexGardService } from './shared/index-gard.service';

const routes: Routes = [
  { path: 'index', component: IndexContentComponent, canActivate: [IndexGardService]  },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'main', component: MainComponent, canActivate: [AuthGuardService] },
  { path: 'profil/:id', component: ProfilComponent, canActivate: [AuthGuardService] },
  { path: 'mon_profil', component: MonProfilComponent, canActivate: [AuthGuardService] },
  { path: 'ajoutDomain', component: AjoutDomainComponent, canActivate: [AuthGuardService] },
  { path: 'messagerie', component: MessagerieComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [AuthGuardService]
})
export class AppRoutingModule {}
