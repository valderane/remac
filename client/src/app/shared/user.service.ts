import { Injectable } from '@angular/core';
import {User} from "./user";
import {Observable, of} from "rxjs/index";
import {HttpClient, HttpParams} from "@angular/common/http";
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

  /*

  - take a domain list
  - update the users list according to the given domain 

  */
  userListByDomain(domain): Observable<User[]> {

    // Setup domain name parameter    
    console.log(domain)
    return this.http.get<User[]>(this.dburl + 'user/' + domain)
    .pipe(
      catchError(this.handleHerror('get params', []))
    );
  }


  /*
  -handle error messages
  */
  private handleHerror<T>(operation = "operation", result?: T){
    return (error, any): Observable<T> =>{
      console.log( operation + "failed:  " + error.message );
      return of(result as T);
    }
  }
}
