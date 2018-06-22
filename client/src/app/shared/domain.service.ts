import { Injectable } from '@angular/core';
import { Domain } from "../shared/domain";
import {Observable, of} from "rxjs/index";

@Injectable({
  providedIn: "root",
})
export class DomainService {

  domains: Domain[];

  constructor() {
    this.domains = [
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

  getDomains(): Observable<Domain[]> {
    return of(this.domains);
  }
}
