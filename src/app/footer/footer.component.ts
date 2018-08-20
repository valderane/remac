import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  toInformations() {
    console.log('hey');
    this.router.navigate(['/informations']);
  }

  toEvents() {
    this.router.navigate(['/events']);
  }

}
