import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'remac';
  change:boolean = false;

  constructor(public userService: UserService, public router: RouterModule) {

  }

  ngOnInit() {
    this.userService.checkAuthentication().then((res)=>{
      this.change = true;
      //  aller au main
    }, (err) => {
      //prevenir le client en cas d'erreur
    });
  }

  changeHeader(){
    this.change = true;
  }

  deconnexion(){
    this.change = false;
    this.userService.logout();
    // aller à l'index
  }

}
