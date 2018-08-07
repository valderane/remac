import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DomainService} from "../shared/domain.service";
import {FormControl} from "@angular/forms";
import {Domain} from "../shared/domain";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-main-selection',
  templateUrl: './main-selection.component.html',
  styleUrls: ['./main-selection.component.css']
})
export class MainSelectionComponent implements OnInit {
  

  @Output() domainsChanges = new EventEmitter(); // for sharing domains and subdomains list

  private domainsList: Domain[] = []; // list of all domais available ( come from the server )
  private subDomainsList: string[]; // list of all subdomains (depending on the domain's choice )
  private villes : string[] = ["paris", "marseille", "grenoble", "versaille"]; // liste de toutes les villes de france


  private domains = new FormControl(); // selected domains
  private subDomains = new FormControl(); // selected sub domains
  private ville = new FormControl(); // selected ville

  private filteredOptions: Observable<Domain[]>;
  private filteredOptionsVille: Observable<string[]>;

  constructor(private domainService:DomainService) { }

  ngOnInit() {
    this.domainService.getDomains().then((res:any[])=> { // recup de la liste totale des domaines
      this.domainsList = res;
    });

    this.filteredOptions = this.domains.valueChanges // appelée pour filter les resultats lors de l'autocompletion
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.filteredOptionsVille = this.ville.valueChanges // appelée pour filter les resultats lors de l'autocompletion
      .pipe(
        startWith(''),
        map(value => this._filterVille(value))
      );

  }

  private _filter(value: string): Domain[] { // filtre les options d'autocompletion
    const filterValue = value.toLowerCase();
    return this.domainsList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterVille(value: string): string[] { // filtre les options d'autocompletion
    const filterValue = value.toLowerCase();
    return this.villes.filter(ville => ville.toLowerCase().includes(filterValue));
  }

  seach() {
    this.domainsChanges.emit({
      domains: [this.domains.value] || [],
      subdomains: this.subDomains.value || [],
      ville: this.ville.value || ""
    });
  }

  changeSubDomainsList(): void { // modify de subDomains list when domains are modified
    this.subDomainsList = [];
    this.subDomains = new FormControl();

    this.domains.value.forEach(domain => {
      this.domainsList.forEach(obj => {
        if (obj.name === domain) {
          obj.subDomains.forEach(subdomain => {
            this.subDomainsList.push(subdomain);
          });
        }
      });
    });
    
    this.domainsChanges.emit({
      domains: this.domains.value || [],
      subdomains: this.subDomains.value || []
    });

  }


  subDomainsSelectedChanged() { // when the user actualize his subDomains list
    this.domainsChanges.emit({
      domains: this.domains.value || [],
      subdomains: this.subDomains.value || []
    });
  }

  
  
}
