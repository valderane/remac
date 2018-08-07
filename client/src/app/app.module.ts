import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// material design
import {
  MatToolbarModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSnackBarModule, MatChipsModule,
  MatButtonModule, MatGridListModule, MatSelectModule, MatCardModule, MatIconModule, MatPaginatorModule, MatListModule, MatDividerModule, MatRadioModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { IndexContentComponent } from './index-content/index-content.component';
import { LoginComponent } from './login/login.component';
import { DescriptionComponent } from './description/description.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { MainComponent } from './main/main.component';
import { MainSelectionComponent } from './main-selection/main-selection.component';
import { MainOptionsComponent } from './main-options/main-options.component';
import { MainUsersComponent } from './main-users/main-users.component';
import { UserCardComponent } from './user-card/user-card.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { ProfilComponent } from './profil/profil.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MonProfilComponent } from './mon-profil/mon-profil.component';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IndexContentComponent,
    LoginComponent,
    DescriptionComponent,
    InscriptionComponent,
    MainComponent,
    MainSelectionComponent,
    MainOptionsComponent,
    MainUsersComponent,
    UserCardComponent,
    ProfilComponent,
    ConversationComponent,
    MonProfilComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    MatPaginatorModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatListModule,
    MatGridListModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
