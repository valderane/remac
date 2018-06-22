import { Injectable } from '@angular/core';
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[];

  constructor() {

    this.users = [
      {
        id: "0",

        firstName: "abdel",

        lastName: "le moine",

        description: "je suis un utilisateur qualifié de cette application géniale",

        email: "valerane@yahoo.fr",

        mdp: "monSuperMotDePasse",

        domains: [],

        subDomains: []

      }
    ]
  }
}
