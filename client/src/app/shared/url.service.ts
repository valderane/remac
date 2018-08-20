import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  url:string = "https://remacserver.herokuapp.com"

  constructor() { }

  getUrl() {
    return this.url;
  }
}
