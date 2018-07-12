import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-main-users',
  templateUrl: './main-users.component.html',
  styleUrls: ['./main-users.component.css']
})
export class MainUsersComponent implements OnInit {

  @Input() users; // list of users 

  constructor() { }

  ngOnInit() {

  }


}
