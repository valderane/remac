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
  boolsConvs: any[] = [];
  conv: any = {}; //conversation selectionnée dans convs
  myId: string = "";
  mesDonnees: any = {};
  interlocuteur: string = "";
  message: string = "";

  url:string;
  socket:any;

  loadConv = false;
  loadConvs = false;



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

    this.loadConvs = true;
    this.messageService.getConvs(this.myId).then( (convs: any[]) => {
      this.loadConvs = false;
      this.convs = convs;

      //trie des convs par ordre de lu 
      for (let i = 0; i < convs.length; i++) {
        this.boolsConvs.push(this.convLu(this.convs[i]));
      }

      let convsTri = [];
      for (let i = 0; i < this.convs.length; i++) {
        if(this.boolsConvs[i]) {
          convsTri.push(this.convs[i])
        }
      }
      for (let i = 0; i < this.convs.length; i++) {
        if(!this.boolsConvs[i]) {
          convsTri.push(this.convs[i])
        }
      }

      this.convs = convsTri;

      //initialisation de conv
      let convId = this.route.snapshot.paramMap.get('conversation');
      console.log("convId =  "+convId);
      this.loadConv = true;
      if(convId) {
        this.messageService.getConv(convId).then( conv => {
          this.loadConv = false;
          this.chargeConv(conv);
        }, err => {
          this.loadConv = false;
          this.chargeConv(convs[0]);
          console.log(err);
        })
      }
      else {
        this.loadConv = false;
        this.chargeConv(convs[0]);
      }
      
    }, err => {
      this.loadConvs = false;
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
    if(conv) {
      this.loadConv = true;
      let autre = this.getExpId(conv);

      this.userService.getUser(autre).then( (user: any) => {
        this.loadConv = false;
        this.interlocuteur = user.lastName +" "+ user.firstName;
        this.conv = conv;
        this.socket.emit('init-conv', {conv: this.conv._id, userId:this.myId});// initialisation de la conv
        this.scrollToBottom(); 
      }, err => {
        this.loadConv = false;
        console.log(err);
      })
    }
    else {
      conv = {}
    }
    
  }

  convLu(convDetails) {
    if(!convDetails.messages[convDetails.messages.length - 1]){
      return true;
    }
    return convDetails.messages[convDetails.messages.length - 1].lu.indexOf(this.myId) > -1;
  }

  sendMessage() {
    if(this.message.length > 0) {
      let msgInfos = {
        exp: this.myId, 
        dest: this.getExpId(this.conv),  
        prenomExp: this.mesDonnees.lastName+" "+this.mesDonnees.firstName || "unset",
        msg: this.message || "message vide",
        lu: [this.myId]
      };
      this.socket.emit('msg', { msgInfos: msgInfos, conv: this.conv._id}); // envoi des données du msg au serveur

      this.conv.messages.push(msgInfos);

      this.message = "";

      this.scrollToBottom(); 
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
