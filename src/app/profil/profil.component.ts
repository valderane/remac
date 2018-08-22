import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { MessageService } from '../shared/message.service';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  userId: string;
  user: any = {};
  myId: any;
  nblikes: number = 0;
  nbdislikes: number = 0;

  userLike: boolean = false;
  userDislike: boolean = false;
  thumbupImage: string = "../../assets/icons/like-disabled.svg";
  thumbdownImage: string = "../../assets/icons/dislike-disabled.svg";

  constructor(public route: ActivatedRoute,
              public userService: UserService,
              public messageService: MessageService,
              public router: Router) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.userService.getUser(this.userId).then((user:any)=>{

      this.user = user;

    }, err => {
      console.log(err);
    })

    // recup de l'id de l'utilisateur
    let token = localStorage.getItem('token');
    let decodedtoken = this.userService.getDecodedAccessToken(token);
    this.myId = decodedtoken._id;

    // recup de si l'utilisateur like deja le profil ou le dislike deja
    this.userService.userLikeDislike({myId:this.myId, userId: this.userId}).then( (data: any) => {
      this.userLike = data.userLike;
      this.userDislike = data.userDislike;
      this.nblikes = this.formateNbLike(data.nblikes);
      this.nbdislikes = this.formateNbLike(data.nbdislikes);
      this.updateThumb();
    }, err => {
      console.log(err);
    })


  }


  updateThumb() {
    if(this.userLike) {
      this.thumbupImage = "../../assets/icons/like-active.svg"
    }
    else {
      this.thumbupImage = "../../assets/icons/like-disabled.svg";
    }

    if(this.userDislike) {
      this.thumbdownImage = "../../assets/icons/dislike-active.svg"
    }
    else {
      this.thumbdownImage = "../../assets/icons/dislike-disabled.svg";
    }
  }

  like() {

    this.userService.like({id:this.userId, idLikeur: this.myId}).then((data:any) => {
      //actualiser le nombre de likes
      this.nblikes = this.formateNbLike(data.nb);
      //actualiser l'image des pouces
      this.userLike = ! this.userLike
      this.updateThumb();
    }, err => {
      console.log(err);
    })


  }

  dislike() {

    this.userService.like({id:this.userId, idLikeur: this.myId}).then((data:any) => {
      //actualiser le nombre de likes
      this.nbdislikes = this.formateNbLike(data.nb);
      //actualiser l'image des pouces
      this.userDislike = ! this.userDislike
      this.updateThumb();
    }, err => {
      console.log(err);
    })


  }


  contacter() {
    this.messageService.getConvId([this.myId,this.userId]).then((conv:any) => {
      this.router.navigate(['/messagerie'], {queryParams: {conversation: conv}})
    }, err => {
      console.log(err);
    });
    
  }

  formateNbLike(nb) {
    let formated = nb/1000;

    if(formated > 1) {
      return (Math.round(formated*10)/10)+"K"
    }
    else {
      return nb;
    }
  }


}
