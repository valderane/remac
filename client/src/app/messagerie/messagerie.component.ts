import { Component, OnInit} from '@angular/core';
import { MessageService } from '../shared/message.service';
import { UserService } from '../shared/user.service';
import * as socketIo from 'socket.io-client';
import { UrlService } from '../shared/url.service';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css']
})
export class MessagerieComponent implements OnInit {

  convs: any[] = [];
  conv: any = {}; //conversation selectionnée dans convs
  myId: string = "";
  mesDonnees: any = {};
  interlocuteur: string = "";
  message: string = "";

  url:string;
  socket:any;

  constructor(public messageService: MessageService, public userService: UserService, public urlService: UrlService) { }

  ngOnInit() {
    let token = localStorage.getItem('token');
    let decodedToken = this.userService.getDecodedAccessToken(token);
    this.myId = decodedToken._id;

    this.userService.getUser(this.myId).then( user => {
      this.mesDonnees = user;
    }, err => {
      console.log(err);
    })

    this.messageService.getConvs(this.myId).then( (convs: any[]) => {
      this.convs = convs;
      //initialisation de conv
      this.chargeConv(convs[0])
    }, err => {
      console.log(err);
    })

    

    //gestion du realTime avec socketIo
    this.url = this.urlService.getUrl();

    this.socket = socketIo(this.url);
    this.socket.on('recieve', data => {
      console.log(data.msg);
      this.conv.messages.push(data.msg);
    });

  }

  getExpId(conv) {
    let membres = conv.membres;
    let autre = "";
    membres.forEach(membre => {
      if(membre != this.myId) {
        autre = membre;
      }
    });

    return autre

  }

  chargeConv(conv) {
    let autre = this.getExpId(conv);

    this.userService.getUser(autre).then( (user: any) => {
      this.interlocuteur = user.lastName +" "+ user.firstName;
      this.conv = conv;
      this.socket.emit('init-conv', {conv: this.conv._id});// initialisation de la conv
    }, err => {
      console.log(err);
    })
  }

  sendMessage() {
    if(this.message.length > 0) {
      let msgInfos = {
        exp: this.myId, 
        dest: this.getExpId(this.conv),  
        prenomExp: this.mesDonnees.lastName+" "+this.mesDonnees.firstName || "unset",
        msg: this.message || "message vide"
      };
      console.log(msgInfos);
      this.socket.emit('msg', { msgInfos: msgInfos, conv: this.conv._id}); // envoi des données du msg au serveur

      this.conv.messages.push(msgInfos);
    }
    
  
  }

}
