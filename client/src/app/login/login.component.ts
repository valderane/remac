import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { HeaderService } from '../shared/header.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  

  constructor(private userService: UserService, private router: Router, public headerService: HeaderService) { }

  @Output() succesConnexion = new EventEmitter(); // tell to the header parent that the connexion is a success

  ngOnInit() {
  }

  login(){
    this.userService.login(this.credentials).then((res:any)=>{
      this.succesConnexion.emit();
      this.headerService.setCurrentUser(res.user);
      this.router.navigate(['/main']); //si on est connecté, on va au main
    }, (err) => {
      // si on ne peut pas se connecter , pervenir le client pourquoi
      console.log(err);
    });
  }


}
