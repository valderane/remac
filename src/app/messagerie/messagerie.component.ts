import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import { MessageService } from '../shared/message.service';
import { UserService } from '../shared/user.service';
import * as socketIo from 'socket.io-client';
import { UrlService } from '../shared/url.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css']
})
export class MessagerieComponent implements OnInit, AfterViewChecked {

  convs: any[] = [];
  conv: any = {}; //conversation selectionnée dans convs
  myId: string = "";
  mesDonnees: any = {};
  interlocuteur: string = "";
  message: string = "";

  url:string;
  socket:any;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(public messageService: MessageService, public userService: UserService, public urlService: UrlService, public route: ActivatedRoute) { }

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
      let convId = this.route.snapshot.paramMap.get('conversation');
      if(convId) {
        this.messageService.getConv(convId).then( conv => {
          this.chargeConv(conv);
        }, err => {
          this.chargeConv(convs[0])
          console.log(err);
        })
      }
      else {
        this.chargeConv(convs[0]);
      }
      
    }, err => {
      console.log(err);
    })

    

    //gestion du realTime avec socketIo
    this.url = this.urlService.getUrl();

    this.socket = socketIo(this.url);
    this.socket.on('recieve', data => {
      this.conv.messages.push(data.msg);
    });

  }

  ngAfterViewChecked() {        
    this.scrollToBottom();   
    this.socket.emit('estDansMessagerie', {id: this.myId});     
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
      this.scrollToBottom(); 
    }, err => {
      console.log(err);
    })
  }

  convLu(convDetails) {
    return convDetails.messages[convDetails.messages.length - 1];
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

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } 
    catch(err) {
      console.log(err)
    }                 
  }

  

}
