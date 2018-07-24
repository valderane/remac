import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// material design
import {
  MatToolbarModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule,
  MatButtonModule, MatGridListModule, MatSelectModule, MatCardModule, MatIconModule, MatPaginatorModule, MatSnackBarModule
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
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
