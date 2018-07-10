import { Injectable } from '@angular/core';
import {User} from "./user";
import {Observable, of} from "rxjs/index";
import {HttpClient, HttpParams, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/internal/operators";
import { Headers, Http} from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[];
  dburl = "http://localhost:5000/";
  token: any;

  constructor(private http: HttpClient, public hp: Http) {
    
  }



  /*
  -check if the user is authentified
  */
  checkAuthentication(){
 
    return new Promise((resolve, reject) => {
 
        //Load token if exists
        this.token = localStorage.getItem('token');
        console.log(this.token);
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer '+this.token );
        console.log(this.token);

        console.log(headers);
        
        this.hp.get(this.dburl + 'api/auth/protected', {headers: headers})
            .subscribe(res => {
                  resolve(res);
              }, (err) => {
                  reject(err);
              });
         
 
    });
 
  }


  /*
  - register a new user
  */
  createAccount(details){
 
    return new Promise((resolve, reject) => {
 
        let headers = new HttpHeaders();

        headers.append('Content-Type', 'application/json');
 
        this.http.post<any>(this.dburl + 'api/auth/register', details, {headers: headers})
          .subscribe(res => {
            let data = res
            this.token = data.token;
            localStorage.setItem('token', this.token);
            resolve(data);
 
          }, (err) => {
            reject(err);
          });
 
    });
 
  }



  /*
  - manage login
  */
 login(credentials){
 
  return new Promise((resolve, reject) => {

      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      this.http.post<any>(this.dburl + 'api/auth/login', credentials, {headers: headers})
        .subscribe(res => {

          let data = res;
          this.token = data.token;
          localStorage.setItem('token', data.token);
          resolve(data);

        }, (err) => {
          reject(err);
        });

  });

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
    return this.http.get<User[]>(this.dburl + 'user/' + domain)
    .pipe(
      catchError(this.handleHerror('get params', []))
    );
  }



  /*
  -to log out 
  */
  logout(){
    localStorage.removeItem('token');
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
