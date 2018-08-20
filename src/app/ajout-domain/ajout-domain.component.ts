import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ClientService } from '../shared/client.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-ajout-domain',
  templateUrl: './ajout-domain.component.html',
  styleUrls: ['./ajout-domain.component.css']
})
export class AjoutDomainComponent implements OnInit {

  public formHandler: FormGroup;

  constructor(public clientService: ClientService,
              public formBuilder: FormBuilder) { }

  ngOnInit() {

    this.formHandler = this.formBuilder.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: [''], 
      domain: [''],
      subDomain: [''],
      autres: ['']
    });
  }

  submit() {
    let details = this.formHandler.value

    if(this.formHandler.valid && (details.domain || details.subDomain)) {
      this.clientService.postDomain(details).then( res => {
        console.log(res)
      }, err => {
        console.log(err)
      })
    }
    else if(!(details.domain || details.subDomain)) {
      // TODO alerter
    }
    else {
      // TODO
    }
  }

}
