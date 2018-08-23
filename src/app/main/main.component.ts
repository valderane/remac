import {Component, OnInit} from '@angular/core';
import {User} from "../shared/user";
import {UserService} from "../shared/user.service";
import { AlertsComponent } from '../alerts/alerts.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  users: User[] = []; //list of users

  pageSize: number = 5; // nombre d'elts d'une page de pagination
  pageIndex: number = 0; // index de la page courante
  pageLenght: number = 10; // nbr total de pages
  eventUpdateDetails: any;

  load: boolean = false;

  constructor(public userService: UserService,
              public dialog:  MatDialog) { }

  ngOnInit() {
    this.users = [];
  }


  /* take all the users */
  getAllUsers() {
    this.userService.getUsers().then((users:any) => {
      this.users = users;
    }, err => {
      console.log(err);
    });
  }



  /*
  update the users list depending on the selection of domains
  */
 
  updateUserList(event) {
    let tableaux = event
    let domains = event.domains;
    this.eventUpdateDetails = event;
     //empty the users list before filling it
    if( typeof domains !== 'undefined' && domains.length > 0){
      this.users = [];

      //nbr d'occurences 
      this.load = true;
      this.userService.countUsers(tableaux).then((data: any) => {
        this.pageLenght = Math.round(data.nbr / this.pageSize);
        console.log(this.pageLenght);
        this.pageIndex = 0;

        //recuperer les elts de la première page
        tableaux.pageLength = this.pageSize;
        tableaux.index = this.pageIndex;
        this.userService.getUsersByDomainSubDomain(tableaux).then((data: any) => {
          this.load = false;
          this.users = data;
        }, err => {
          this.load = false;
          this.openDialog('Erreur', 'Une erreur est survenue lors du traitement de votre requête. Assurez vous que vous avez une bonne connexion internet puis réessayez')
        });

      }, err => {
        this.load = false;
        this.openDialog('Erreur', 'Une erreur est survenue lors du traitement de votre requête. Assurez vous que vous avez une bonne connexion internet puis réessayez')
      });

      

    }
    else{
      //if not , take the default list
      this.users = [];
    }
  }
 


  /**
   * manage pagination of users 
   * @param event contain pagination index
   */
  pageEvent(event) {

    this.pageIndex = event.pageIndex;

    this.eventUpdateDetails.pageIndex = this.pageIndex;
    this.userService.getUsersByDomainSubDomain(this.eventUpdateDetails).then((data: any) => {
      this.users = data;
    }, err => {
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
