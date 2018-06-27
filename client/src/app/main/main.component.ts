import {Component, OnInit} from '@angular/core';
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
    this.userService.userListByDomain(domains_subDomains.domains[0]).subscribe(users => {
      this.users = users;
    });
  }

  /*
  - take a user list (result of a request)
  - add it to the local users variable (for distincts values)

  */

  addToUsers(anotherUsersList): void {
    anotherUsersList.forEach(user => {
      //check if the user is already in the users array, if not add him 
      if( !( this.users.indexOf(user) > -1 ) ){

        this.users.push(user);

      }
    });
  }

}
