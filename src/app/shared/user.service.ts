import { Injectable } from '@angular/core';
import {User} from "./user";
import {Observable, of} from "rxjs";
import {HttpClient, HttpParams, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/internal/operators";
import { Headers, Http} from '@angular/http';
import { promise } from 'protractor';
import { resolve } from 'path';
import {  MatSnackBar } from '@angular/material';
import * as jwt_decode from "jwt-decode";
import { JwtHelperService } from '@auth0/angular-jwt';
import { UrlService } from './url.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[];
  dburl;
  token: any;
  inscriptionOk: string = "inscription réussie, ouvrez votre boîte email pour confirmer votre adresse email. Vous pourrez ensuite vous connecter"

  constructor(public http: HttpClient, public hp: Http, public snackBar: MatSnackBar, public jwtHelper: JwtHelperService, public urlService: UrlService) {
    this.dburl = urlService.getUrl();
  }



  /*
  -check if the user is authentified
  */
  checkAuthentication(){
 
    return new Promise((resolve, reject) => {
 
        //Load token if exists
        this.token = localStorage.getItem('token');
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer '+this.token );
        
        this.hp.get(this.dburl + 'api/auth/protected', {headers: headers})
            .subscribe(res => {
                  resolve(res);
              }, (err) => {
                  reject(err);
              });
         
 
    });
 
  }


  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    if(!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
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
            /*
            this.token = data.token;
            localStorage.setItem('token', this.token);
            */
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




  getUsers() {

    return new Promise((resolve, reject) => {
      this.token = localStorage.getItem('token');
      let headers = new Headers();
  
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+this.token );
  
      return this.hp.get(this.dburl + "user", {headers: headers})
                    .subscribe((data: any) => {
                      data = data.json();
                      resolve(data);
                    }, (err) => {
                      reject(err);
                    })
      
    });

  }


  /**
   * 
   */
  getUser(id) {

    return new Promise((resolve, reject) => {
      this.token = localStorage.getItem('token');
      let headers = new Headers();
  
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+this.token );
  
      return this.hp.get(this.dburl + "userById/"+id, {headers: headers})
                    .subscribe((data: any) => {
                      data = data.json();
                      resolve(data);
                    }, (err) => {
                      reject(err);
                    })
      
    });

  }

  /**
   * 
   */
  getUsersByDomainSubDomain(tableaux) {

    return new Promise((resolve, reject) => {

      this.token = localStorage.getItem('token');
      let headers = new Headers();
  
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+this.token );

      this.hp.get(this.dburl + 'getUsersByDomainSubdomain', {headers: headers, params: tableaux}).subscribe(data => {
        resolve(data.json());
      }, err => {
        reject(err);
      })

    });
    
  }

  /**
   * 
   */
  countUsers(tableaux) {

    return new Promise((resolve, reject) => {
      this.token = localStorage.getItem('token');
      let headers = new Headers();
  
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+this.token );
  
      return this.hp.get(this.dburl + "userDomainNbr", {headers: headers, params: tableaux } )
                    .subscribe((data: any) => {
                      data = data.json();
                      resolve(data);
                    }, (err) => {
                      reject(err);
                    })
      
    });

  }


  /*

  - take a domain list
  - update the users list according to the given domain 

  */
  userListByDomain(domain): any{

    this.token = localStorage.getItem('token');
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer '+this.token );

    // Setup domain name parameter    
    return this.hp.get(this.dburl + 'user/' + domain, {headers: headers})
    .pipe(
      catchError(this.handleHerror('get params', []))
    );
  }


  updateUser(id, userDetails) {
    return new Promise((resolve, reject) => {
      this.hp.put(this.dburl + 'user/'+id, userDetails).subscribe( res=> {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }


  /*
  like
  */
  like(details) {

    return new Promise((resolve, reject) => {
      this.hp.put(this.dburl + 'like',details).subscribe( res=> {
        resolve(res.json());
      }, err => {
        reject(err);
      })
    }) 

  }

  dislike(details) {

    return new Promise((resolve, reject) => {
      this.hp.put(this.dburl + 'like',details).subscribe( res=> {
        resolve(res.json());
      }, err => {
        reject(err);
      })
    }) 

  }


  nblike(id) {

    return new Promise((resolve, reject) => {
      this.hp.get(this.dburl + 'nblike/'+id).subscribe( res=> {
        resolve(res.json());
      }, err => {
        reject(err);
      })
    }) 

  }

  nbdislike(id) {

    return new Promise((resolve, reject) => {
      this.hp.get(this.dburl + 'nbdislike/'+id).subscribe( res=> {
        resolve(res.json());
      }, err => {
        reject(err);
      })
    }) 

  }

  userLikeDislike(details) {
    return new Promise((resolve, reject) => {
      this.hp.get(this.dburl + 'isUserLikeDislike', {params:details}).subscribe( res=> {
        resolve(res.json());
      }, err => {
        reject(err);
      })
    }) 

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
  public handleHerror<T>(operation = "operation", result?: T){
    return (error, any): Observable<T> =>{
      console.log( operation + "failed:  " + error.message );
      return of(result as T);
    }
  }




  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  formaterNom(nom: string): string {
    return nom[0].toUpperCase() + nom.slice(1).toLowerCase();
  } 

}
