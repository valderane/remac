import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

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

  

  constructor(private userService: UserService, private router: Router) { }

  @Output() succesConnexion = new EventEmitter(); // tell to the header parent that the connexion is a success

  ngOnInit() {
  }

  login(){
    this.userService.login(this.credentials).then((res)=>{
      this.succesConnexion.emit();
      this.router.navigate(['/main']); //si on est connecté, on va au main
    }, (err) => {
      // si on ne peut pas se connecter , pervenir le client pourquoi
      console.log(err);
    });
  }


}
