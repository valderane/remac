import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  @Input() convId: string; // id de la conversation à afficher

  constructor() { }

  ngOnInit() {
    //recuperation de la conversation en question

  }

}
