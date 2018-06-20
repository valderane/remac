import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { Domain } from '../shared/domain';
import { FormControl } from '@angular/forms';

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
  private domainsList: Domain[]; // list of all domais available ( come from the server )
  private subDomainsList: string[]; // list of all subdomains (depending on the domain's choice )


  private domains = new FormControl(); // selected domains
  private subDomains = new FormControl(); // selected sub domains

  constructor() { }

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

  submit(): void {
    for (const key in this.user) {
      if (this.user.hasOwnProperty(key)) {
        console.log(true);
      }
    }
    console.log(this.user);
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
