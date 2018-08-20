import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class VillesService {

  dbUrl: string;

  constructor(public http: Http, public urlService: UrlService) {
    this.dbUrl = urlService.getUrl();
   }

  url(codePostal){
    return "https://geo.api.gouv.fr/communes?codePostal="+codePostal+"&fields=nom&format=json&geometry=centre"
  }

  getVille(codePostal) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url(codePostal)).subscribe(res => {
        resolve(res.json());
      }, err => {
        reject(err);
      })
    })
    
  }

  getAdresse(mockAdress) {
    // TODO
  }

  getVillesDB() {
    return new Promise((resolve, reject) => {
      this.http.get(this.dbUrl+'villes').subscribe(res => {
        resolve(res.json());
      }, err => {
        reject(err);
      })
    })
  }

}
