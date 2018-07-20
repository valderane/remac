import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DomainService} from "../shared/domain.service";
import {FormControl} from "@angular/forms";
import {Domain} from "../shared/domain";

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

  constructor(private domainService:DomainService) { }

  ngOnInit() {
    this.domainService.getDomains().subscribe(domains => {
      this.domainsList = domains;
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
