import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  url:string;
  constructor(public urlService: UrlService ,public http: Http) {
    this.url = urlService.getUrl();
   }

  postDomain(details) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'/ajoutDomain', details).subscribe(res=>{
        resolve(res.json())
      }, err => {
        reject(err)
      })
    })
  }
}
