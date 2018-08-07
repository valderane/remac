import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mon-profil',
  templateUrl: './mon-profil.component.html',
  styleUrls: ['./mon-profil.component.css']
})
export class MonProfilComponent implements OnInit {

  user: any = {};
  
  peutModifierDescription: boolean = false;
  devoileAjoutEmail: boolean = false;
  devoileAjoutTel: boolean = false;
  devoileAjoutParcours: boolean = false;
  devoileAjoutTarif: boolean = false;
  devoileAjoutSite : boolean = true;

  description: string;
  formation:any = {};
  tarif:any = {};
  email: string;
  tel:string;
  site:string;
  entreprise:any = {};

  adresse:string;
  cp:any;
  ville: string;

  constructor(public route: ActivatedRoute,
              public userService: UserService) {
    let token = localStorage.getItem('token');
    let decodedToken = this.userService.getDecodedAccessToken(token);
    let userId = decodedToken._id;
    this.userService.getUser(userId).then((user:any)=>{
      console.log(user);
      this.user = user;
      this.cp = user.cp * 1;
      this.ville = user.ville;
      this.user.firstName = userService.formaterNom(this.user.firstName);
      this.user.lastName = userService.formaterNom(this.user.lastName);
    }, err => {
      console.log(err);
    })
   }

  ngOnInit() {
  }


  allowModDescription() {
    this.peutModifierDescription = true;
  }

  terminerModDescription() {
    this.peutModifierDescription = false;
    // update le user dans le serveur
  }

  modifieDescription() {
    this.user.description = this.description;
  }

  addEmail() {
    if(!this.user.emails){
      this.user.emails = [];
    }
    this.user.emails.push(this.email);
    this.email = "";
    this.devoileAjoutEmail = false;
    // update le user dans le serveur
  }

  addTel() {
    if(!this.user.tels){
      this.user.tels = [];
    }
    this.user.tels.push(this.tel);
    this.tel = "";
    this.devoileAjoutTel = false;
    // update le user dans le serveur
  }

  addAdress() {
    if(this.adresse && this.cp && this.ville) {
      if(this.user.adresses) {
        this.user.adresses.push({adresse:this.adresse, ville:this.ville, cp:this.cp});
      }
      else {
        this.user.adresses = [];
        this.user.adresses.push({adresse:this.adresse, ville:this.ville, cp:this.cp});
      }
    }
  }

  addSite() {
    if(!this.user.sites){
      this.user.sites = [];
    }
    this.user.sites.push(this.site);
    this.site = "";
    // update le user dans le serveur
  }

  addParcours() {
    if(!this.user.formation) {
      this.user.formation = []
    }

    if(this.formation.label && this.formation.content) {
      this.user.formation.push(this.formation);
    }

    this.formation = {}
    this.devoileAjoutParcours = false;
  }

  addTarif() {
    if(!this.user.tarifs) {
      this.user.tarifs = []
    }

    if(this.tarif.label && this.tarif.prix) {
      this.user.tarifs.push(this.tarif);
    }

    this.tarif = {}
    this.devoileAjoutTarif = false;
  }

  remove(field, value) {

    if(field == 'email'){
      this.user.emails.splice(this.user.emails.indexOf(value), 1);
    }

    if(field == 'tel') {
      this.user.tels.splice(this.user.tels.indexOf(value), 1);
    }

    if(field == 'formation') {
      this.user.formation.splice(this.user.tels.indexOf(value), 1);
    }

    if(field == 'tarif') {
      this.user.tarifs.splice(this.user.tarifs.indexOf(value), 1);
    }

  }

  devoileAjoutEmailFunc() {
    this.devoileAjoutEmail = true;
  }

  devoileAjoutTelFunc() {
    this.devoileAjoutTel = true;
  }

  devoileAjoutParcoursFunc() {
    this.devoileAjoutParcours = true;
  }

  devoileAjoutTarifFunc() {
    this.devoileAjoutTarif = true;
  }

  devoileAjoutSiteFunc() {
    this.devoileAjoutSite = true;
  }

}
