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

  pageSize: Number = 5; // nombre d'elts d'une page de pagination
  pageIndex: Number = 1; // index de la page courante
  pageLenght: Number = 100; // nbr total de pages

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getAllUsers();
  }


  /* take all the users */
  getAllUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }


  /*
  -take a domain
  -return a list of people that have this domain on their domain list
  */
  userListByDomain(domain) {
    this.userService.userListByDomain(domain).subscribe(users => {
      this.addToUsers(users);
    });
  }




  /*
  update the users list depending on the selection of domains
  */
 
  updateUserList(event) {
    let domains = event;
    console.log(domains);
     //empty the users list before filling it
    if( typeof domains !== 'undefined' && domains.length > 0){
      this.users = [];
      //if the list of domains list if not empty ...
      domains.forEach(domain => {
        this.userListByDomain(domain);
      });
    }
    else{
      //if not , take the default list
      this.getAllUsers();
    }
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


  /**
   * manage pagination of users 
   * @param event contain pagination index
   */
  pagination(event) {
    this.pageIndex = event.pageIndex;
  }

}
