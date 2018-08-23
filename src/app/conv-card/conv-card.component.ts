import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-conv-card',
  templateUrl: './conv-card.component.html',
  styleUrls: ['./conv-card.component.css']
})
export class ConvCardComponent implements OnInit {

  @Input() conv: any;
  @Input() expId: string;
  @Input() convLu: boolean;
  prenomExp: string = "";
  lastMessage: string = "";
  image:string = "http://st.depositphotos.com/1779253/5140/v/950/depositphotos_51404241-stock-illustration-female-profile-avatar-icon-white.jpg";

  constructor(public userService : UserService) { }

  ngOnInit() {
    this.lastMessage = this.conv.messages[this.conv.length - 1];

    this.userService.getUser(this.expId).then( (user: any) => {
      this.prenomExp = user.lastName +" "+ user.firstName;
    }, err => {
      console.log(err);
    })
  }

}
