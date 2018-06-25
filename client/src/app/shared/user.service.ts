import { Injectable } from '@angular/core';
import {User} from "./user";
import {Observable, of} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/internal/operators";
import {$} from "protractor";
import * as domain from "domain";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[];
  dburl = "http://localhost:8080/"

  constructor(private http: HttpClient) {

  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.dburl + "user")
      .pipe(
        catchError(this.handleHerror('get users', []))
      )
  }

  private handleHerror<T>(operation = "operation", result?: T){
    return (error, any): Observable<T> =>{
      console.log( operation + "failed:  " + error.message );
      return of(result as T);
    }
  }



  /*

  - take an object { domains : list of selected domains, subdomains : list of selected subdomains }
  - update the users list according to the given domains and subdomains list

  */
  updateUserList(domains_subDomains): Observable<any> {
    return this.http.get(this.dburl + "/user", {params : {domain_subdomain: domains_subDomains}});
  }
}
