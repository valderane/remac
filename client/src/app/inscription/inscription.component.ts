import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { Domain } from '../shared/domain';
import { FormControl } from '@angular/forms';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  /*
    gere et valide les données des formulaires
  */

  private user: User; // new user's configs
  private mdp: string; // confirm mdp variable
  private mdpValid: boolean;
  private domainsList: Domain[]; // list of all domais available ( come from the server )
  private subDomainsList: string[]; // list of all subdomains (depending on the domain's choice )


  private domains = new FormControl(); // selected domains
  private subDomains = new FormControl(); // selected sub domains

  constructor(public userService: UserService) { }

  ngOnInit() {

    this.user = new User();

    this.domainsList = [
      {
        name: 'Informaticien',
        subDomains: [
          'programmeur',
          'developpeur',
          'chanteur',
          'game designer',
          'infographiste'
        ]
      },
      {
        name: 'Musicien',
        subDomains: [
          'programmeur',
          'developpeur',
          'chanteur',
          'game designer',
          'infographiste'
        ]
      },
      {
        name: 'Electricien',
        subDomains: [
          'programmeur',
          'developpeur',
          'chanteur',
          'game designer',
          'infographiste'
        ]
      }
    ];

  }

  compareMdp(){
    this.mdpValid = ( this.user.password === this.mdp );
  }

  submit(): void {

    if(!this.mdpValid){
      //passwords didn't match
      console.log("wrong password");
    }
    else{
      //register the customer
      this.userService.createAccount(this.user).then((result) => {
        console.log(result);
      }, (err) => {
        console.log(err);
      });

    }

  }

  changeSubDomainsList(): void { // modify de subDomains list when domains are modified
    this.subDomainsList = [];
    this.subDomains = new FormControl();

    this.domains.value.forEach(domain => {
      this.domainsList.forEach(obj => {
        if (obj.name === domain) {
          obj.subDomains.forEach(subdomain => {
            this.subDomainsList.push(subdomain);
          });
        }
      });
    });

  }


}
