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

  private domainsList: Domain[]; // list of all domais available ( come from the server )
  private subDomainsList: string[]; // list of all subdomains (depending on the domain's choice )


  private domains = new FormControl(); // selected domains
  private subDomains = new FormControl(); // selected sub domains

  private filteredOptions: Observable<Domain[]>;

  constructor(private domainService:DomainService) { }

  ngOnInit() {
    this.domainService.getDomains().subscribe(domains => { // recup de la liste totale des domaines
      this.domainsList = domains;
    });

    this.filteredOptions = this.domains.valueChanges // appelée pour filter les resultats lors de l'autocompletion
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }

  private _filter(value: string): Domain[] { // filtre les options d'autocompletion
    const filterValue = value.toLowerCase();
    return this.domainsList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  seach() {
    this.domainsChanges.emit({
      domains: [this.domains.value] || [],
      subdomains: this.subDomains.value || []
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
