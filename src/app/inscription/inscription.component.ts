import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Domain } from '../shared/domain';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { HeaderService } from '../shared/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomainService } from '../shared/domain.service';
import { VillesService } from '../shared/villes.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  /*
    gere et valide les données des formulaires
  */

  public user: any = {}; // new user's configs
  public mdp: string; // confirm mdp variable
  public mdpValid: boolean;
  public domainsList: Domain[] = []; // list of all domais available ( come from the server )
  public inscriptionOk: string = "inscription réussie, ouvrez votre boîte email pour confirmer votre adresse email. Vous pourrez ensuite vous connecter"
  
  public subDomainsList: string[] = []; // list of all subdomains (depending on the domain's choice )

  public domain: string;

  public registerForm: FormGroup;
  public submitted = false;
  public wrong_password = false;


  public filteredOptions: Observable<Domain[]>;
  public filteredOptionsSub: Observable<Domain[]>;


  

  constructor(public userService: UserService, 
              public domainService: DomainService,
              public villeService: VillesService,
              public router: Router, 
              public headerService: HeaderService, 
              public formBuilder:  FormBuilder,
              public snackBar: MatSnackBar) { }

  ngOnInit() {

    //============== recup des domains et sous domains ===============

    this.domainService.getDomains().then((res: any[]) => {
      this.domainsList = res;
    }, err => {

    })

    this.domainService.getSubDomains().then((res: any[]) => {
      this.subDomainsList = res;
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

    //========== initialisation de l'autocomp ========================

    this.filteredOptions = this.registerForm.controls.domain.valueChanges // appelée pour filter les resultats lors de l'autocompletion
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.domainsList))
      );

    this.filteredOptionsSub = this.registerForm.controls.subDomain.valueChanges // appelée pour filter les resultats lors de l'autocompletion
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.subDomainsList))
      );

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
      //this.alertService.setMessage("Les mots de passe ne correspondent pas!",'error');
    
    }
    
    else{
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
            // TODO enregister l'utilisateur
            this.userService.createAccount(this.user).then((result) => {
              //this.headerService.updateChange(true);
              //this.router.navigate(['/main']);
               /* prevenir le client qu'il doit vérifier son email */
              this.registerForm.reset();
              //this.alertService.setMessage(this.inscriptionOk,'success');
      
            }, (err) => {
              console.log(err.json());
            });
         }
         else{
           // code postal invalide
           //this.alertService.setMessage("code postal invalide",'error');
         }
       }, err => {
        //this.alertService.setMessage(err.json().error,'error');
         console.log(err);
       })

      }
      else {
        //this.alertService.setMessage("Vous devez remplir correctement tous les champs",'error');
      }

    }
    
  }

  public _filter(value: string, tab: any[]): Domain[] { // filtre les options d'autocompletion
    const filterValue = this.noAccent( value.toLowerCase() );
    return tab.filter(option => this.noAccent(option.name.toLowerCase()).includes(filterValue));
  }


  public noAccent(str) {
    var newStr = str;
    return newStr.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  }
  
}
