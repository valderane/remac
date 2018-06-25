import {Component, OnInit, ViewChild} from '@angular/core';
import {MainUsersComponent} from "../main-users/main-users.component";
import {User} from "../shared/user";
import {UserService} from "../shared/user.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  users: User[]; //list of users

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  updateUserList(domains_subDomains) {
    this.userService.updateUserList(domains_subDomains);
  }




}
