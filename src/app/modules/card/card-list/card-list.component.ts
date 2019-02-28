import { Component, OnInit } from '@angular/core';
import {CardService} from '@app/core';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {

    cards: Array<any>;

    constructor(private cardService: CardService) { }

    ngOnInit() {
        this.cardService.getAll().subscribe(data => {
            this.cards = data;
        });
    }

}

