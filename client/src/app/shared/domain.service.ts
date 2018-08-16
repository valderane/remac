import { Injectable } from '@angular/core';
import { Domain } from "./domain";
import {Observable, of} from "rxjs";
import { Http } from '@angular/http';
import { UrlService } from './url.service';

@Injectable({
  providedIn: "root",
})
export class DomainService {

  domains: Domain[];
  url:string;

  constructor(public http: Http, public urlService: UrlService ) {
    this.url = urlService.getUrl();
  }

  getDomains() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url+'/domains').subscribe(res => {
        resolve(res.json().data);
      }, err => {
        console.log("une erreur s'est produite lors de la récupération des domains");
      })
    })
    
  }

  getSubDomains() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url+'/subDomains').subscribe(res => {
        resolve(res.json().data);
      }, err => {
        console.log("une erreur s'est produite lors de la récupération des professions");
      })
    })
    
  }
}
