import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class VillesService {

  constructor(public http: Http) { }

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

}
