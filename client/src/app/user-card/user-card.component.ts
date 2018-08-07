import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input() user;

  constructor(public router: Router, public userService : UserService) { }

  ngOnInit() {
    this.user.firstName = this.userService.formaterNom(this.user.firstName);
    this.user.lastName = this.userService.formaterNom(this.user.lastName);
  }

  voirProfil(userId) {
    this.router.navigate(['/profil', userId]);
  }

}
