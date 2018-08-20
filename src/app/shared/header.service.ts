import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public change = new Subject<boolean>();  // cette variable dit si oui ou non le header a changé
  public currentUser = new Subject<User>();

  change$ = this.change.asObservable();
  currentUser$ = this.currentUser.asObservable();


  constructor() { }

  updateChange(value: boolean): void{
    this.change.next(value);
  }

  setCurrentUser(user: any): void{
    this.currentUser.next(user);
  }

}
