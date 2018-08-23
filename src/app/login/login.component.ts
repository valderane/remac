import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { HeaderService } from '../shared/header.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { MatDialog } from '@angular/material';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials: any = {
    email: null,
    password: null
  }

  load: boolean = false;

  constructor(public userService: UserService, 
              public router: Router, 
              public headerService: HeaderService,
              public dialog: MatDialog) { }

  @Output() succesConnexion = new EventEmitter(); // tell to the header parent that the connexion is a success

  ngOnInit() {
  }

  login(){
    this.load = true;
    this.userService.login(this.credentials).then((res:any)=>{
      this.load = false;
      this.succesConnexion.emit()
      this.headerService.setCurrentUser(res.user);
      localStorage.setItem('token', res.token);
      this.router.navigate(['/main']); //si on est connecté, on va au main
    }, (err) => {
      // si on ne peut pas se connecter , pervenir le client pourquoi
      this.load = false;
      this.openDialog("Erreur", "Adresse email ou mot de passe invalide...");
      console.log(err);
    });
  }


  public openDialog(title, text) {
    this.dialog.open(AlertsComponent, {
      width:'350px',
      data: {
        title: title,
        text:text
      }
    });
  }
  


}
