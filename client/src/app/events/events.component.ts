import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
 
  private filteredOptions: Observable<any[]>;
  villeslist: any[];
  villes:any = new FormControl();

  constructor() { }

  ngOnInit() {

    this.villeslist = [
      "Marseille",
      "Paris",
      "Lyon",
      "Bordeaux"
    ]

    this.filteredOptions = this.villes.valueChanges // appelée pour filter les resultats lors de l'autocompletion
      .pipe(
        startWith(''),
        map((value:string) => this._filter(value, this.villeslist))
      );
  }

  seach() {

  }

  private _filter(value: string, tab: any[]): any[] { // filtre les options d'autocompletion
    const filterValue = this.noAccent( value.toLowerCase() );
    return tab.filter(option => this.noAccent(option.toLowerCase()).includes(filterValue));
  }

  private noAccent(str) {
    var newStr = str;
    return newStr.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  }
}
