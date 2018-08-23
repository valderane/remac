import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  text: string = "";
  title: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlertsComponent>) { }

  ngOnInit() {
    this.text = this.data.text || "";
    this.title = this.data.title || "";
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }

}
