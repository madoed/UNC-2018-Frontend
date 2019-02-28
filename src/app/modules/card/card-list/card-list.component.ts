import { Component, OnInit } from '@angular/core';
import {AuthService, CardService, User} from '@app/core';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {

    cards: Array<any>;
    private currentUser: User;

    constructor(private cardService: CardService, private authService: AuthService) { }

    ngOnInit() {
        this.authService.user.subscribe(data => this.currentUser = data);
        this.cardService.getAll(this.currentUser.id).subscribe(data => {
            this.cards = data;
        });
    }

}

