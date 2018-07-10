import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { HeaderService } from '../shared/header.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'remac';
  change:boolean = false;
  //change2: boolean =  false;
  currentUser: User = new User();

  constructor(public userService: UserService, public router: Router, public headerService: HeaderService) {
  }

  ngOnInit() {
    this.changeHeaderIfAuth(); // si l'utilisateur est deja authentifié changer le header

    this.headerService.change$.subscribe((data)=>{ // si l'utilisateur clique sur le bouton d'inscription changer le header
      this.change = data;
    });

    this.headerService.currentUser$.subscribe((user)=>{ // une fois connecté, récuperer les données de l'utilisateur
      this.currentUser = user;
    });

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

  changeHeaderIfAuth(){
    this.userService.checkAuthentication().then((res)=>{
      this.change = true;
      //  aller au main
    }, (err) => {
      //prevenir le client en cas d'erreur
    });
  }

}
