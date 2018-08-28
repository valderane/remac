import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { HeaderService } from '../shared/header.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as socketIo from 'socket.io-client';
import { UrlService } from '../shared/url.service';
import { MessageService } from '../shared/message.service';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'Remac';
  change:boolean = false;
  userUpdated:boolean = false;
  //change2: boolean =  false;
  currentUser: any = {};

  decodedToken: any;

  url:any;
  socket: any;
  nbMessages = 0; // nb de messages non lus

  @Output()
  changeTitle = new EventEmitter();
  @Output()
  resetTitle = new EventEmitter();


  constructor(public userService: UserService, 
              public router: Router, 
              public headerService: HeaderService, 
              public urlService: UrlService,
              public messageService: MessageService ) {

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

      // recuperer le nb de messages non lus
      this.messageService.getNbConvsNonLu(this.currentUser._id).then((res:any)=> {
        this.nbMessages = res.nb;
      })
    });

    //si l'utilisateur recharge la page, recuperer l'utilisateur courant dans le token sauvegardé
    if(!this.userUpdated){
      if(localStorage.getItem('token')) {
        const helper = new JwtHelperService();
        this.currentUser = helper.decodeToken(localStorage.getItem('token'));
        this.currentUser.firstName = this.userService.formaterNom(this.currentUser.firstName);
      }
    }

    //gestion du realTime avec socketIo
    this.url = this.urlService.getUrl();
    this.socket = socketIo(this.url);
    this.socket.emit('init-notif', {userId: this.currentUser._id});
    this.socket.on('recieve', data => {
      this.nbMessages++;
      this.changeTitle.emit(this.nbMessages);
      console.log('notification !!!!!!!!!!')
    });

    this.socket.on('estDansMessagerie', data => {
      this.nbMessages = 0;
      this.resetTitle.emit();
      console.log('reseted');
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

  toAcceuil() {
    this.router.navigate(['/main']);
  }

  toMessagerie() {
    this.nbMessages = 0;
    this.resetTitle.emit();
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
