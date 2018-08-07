import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from '../shared/user';
import { Domain } from '../shared/domain';
import { FormControl } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { headersToString } from 'selenium-webdriver/http';
import { HeaderService } from '../shared/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomainService } from '../shared/domain.service';
import { VillesService } from '../shared/villes.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  /*
    gere et valide les données des formulaires
  */

  private user: any = {}; // new user's configs
  private mdp: string; // confirm mdp variable
  private mdpValid: boolean;
  private domainsList: Domain[] = []; // list of all domais available ( come from the server )
  private inscriptionOk: string = "inscription réussie, ouvrez votre boîte email pour confirmer votre adresse email. Vous pourrez ensuite vous connecter"
  
  private subDomainsList: string[] = []; // list of all subdomains (depending on the domain's choice )

  private domain: string;

  private registerForm: FormGroup;
  private submitted = false;
  private wrong_password = false;


  

  constructor(public userService: UserService, 
              public domainService: DomainService,
              public villeService: VillesService,
              public router: Router, 
              public headerService: HeaderService, 
              public formBuilder:  FormBuilder,
              public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.domainService.getDomains().then((res: any[]) => {
      this.domainsList = res;
    }, err => {

    })

    // initialisation du formGroup
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cp: ['', Validators.required],
      tel: ['', Validators.required], 
      cmdp: [''],
      domain: ['', Validators.required],
      subDomain: ['', Validators.required]
    });

  }

  compareMdp(){
    this.mdpValid = ( this.user.password === this.mdp );
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  submit(): void {
    this.submitted = true;
    if(!this.mdpValid){
      //passwords didn't match
      this.wrong_password = true;
    
    }
    
    else{
      //register the customer
      /*
      this.userService.createAccount(this.user).then((result) => {
        //this.headerService.updateChange(true);
        //this.router.navigate(['/main']);

        console.log(result);
      }, (err) => {
        console.log(err);
      });
      */
     console.log(this.registerForm.valid)
     if(this.registerForm.valid){
       this.user = this.registerForm.value; 
       var codePostale = this.user.cp;
       this.villeService.getVille(codePostale).then((res: any[]) => {
         if(res.length > 0) {
            this.user.ville = res[0].nom; 
            this.user.emails = [this.user.email];
            this.user.tels = [this.user.tel];
            this.user.domains = [this.user.domain];
            this.user.subDomains = [this.user.subDomain];
            console.log(this.user);
            // TODO enregister l'utilisateur
            this.userService.createAccount(this.user).then((result) => {
              //this.headerService.updateChange(true);
              //this.router.navigate(['/main']);
               /* prevenir le client qu'il doit vérifier son email */
              this.snackBar.open(this.inscriptionOk, "ok", {duration: 1000, horizontalPosition:'right'});
      
            }, (err) => {
              console.log(err);
            });
         }
         else{
           // code postal invalide
         }
       }, err => {
         console.log(err);
       })

      }

    }
    
  }

  updateSubDomainsList(event): void { // modify de subDomains list when domains are modified
    this.subDomainsList = [];
    this.domainsList.forEach(domain => {
      if(domain.name == event) {
        this.subDomainsList = domain.subDomains;
      }
    });

  }

}
