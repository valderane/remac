import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { HeaderService } from '../shared/header.service';
import { User } from '../shared/user';
import { JwtHelperService } from '@auth0/angular-jwt';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'remac';
  change:boolean = false;
  userUpdated:boolean = false;
  //change2: boolean =  false;
  currentUser: any = {};

  decodedToken: any;

  constructor(public userService: UserService, public router: Router, 
              public headerService: HeaderService) {

  }

  ngOnInit() {
    this.changeHeaderIfAuth(); // si l'utilisateur est deja authentifié changer le header

    this.headerService.change$.subscribe((data)=>{ // si l'utilisateur clique sur le bouton d'inscription changer le header
      this.change = data;
    });

    this.headerService.currentUser$.subscribe((user)=>{ // une fois connecté, récuperer les données de l'utilisateur
      this.currentUser = user;
      this.currentUser.firstName = this.userService.formaterNom(this.currentUser.firstName);
      this.userUpdated = true;
    });

    //si l'utilisateur recharge la page, recuperer l'utilisateur coureant dans le token sauvegardé
    if(!this.userUpdated){
      const helper = new JwtHelperService();
      this.currentUser = helper.decodeToken(localStorage.getItem('token'));
      this.currentUser.firstName = this.userService.formaterNom(this.currentUser.firstName);
    }
    
  }

  changeHeader(){
    this.change = true;
  }

  deconnexion(){
    this.change = false;
    this.userService.logout();
    this.router.navigate(['/index']);
    // aller à l'index
  }

  toAcceuil() {
    this.router.navigate(['/main']);
  }

  toMessagerie() {
    this.router.navigate(['/messagerie']);
  }

  toEvents() {
    this.router.navigate(['/events']);
  }

  changeHeaderIfAuth(){
    this.userService.checkAuthentication().then((res)=>{
      this.change = true;
      //  aller au main
    }, (err) => {
      //prevenir le client en cas d'erreur
    });
  }

  monProfil() {
    this.router.navigate(['mon_profil']);
  }

}
