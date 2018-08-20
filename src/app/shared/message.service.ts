import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  url:string;

  constructor(public urlService: UrlService, public http: Http) {
    this.url = urlService.getUrl();
  }

   getConvs(userId) {

    return new Promise((resolve, reject) => {

      this.http.get( this.url + 'convs/' + userId ).subscribe(res => {
        let data = res.json();
        resolve(data);
      }, err => {
        reject(err);
      });

    });

  }


  getConv(convId) {
    
    return new Promise((resolve, reject) => {

      this.http.get( this.url + 'conv/' + convId ).subscribe(res => {
        let data = res.json();
        resolve(data);
      }, err => {
        reject(err);
      });

    });

  }


  addConv(conv) {
    
    return new Promise((resolve, reject) => {

      this.http.post( this.url + 'conv/' , conv).subscribe(res => {
        let data = res.json();
        resolve(data);
      }, err => {
        reject(err);
      });

    });

  }

  getConvId(membres: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'convId', {params: {membres: membres}}).subscribe((res) => {
        resolve(res.json())
      }, err => {
        reject(err);
      });
    });
  }



}
