import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CardService} from '@app/core';

@Component({
  selector: 'app-card-pay',
  templateUrl: './card-pay.component.html',
  styleUrls: ['./card-pay.component.css']
})
export class CardPayComponent implements OnInit {
    cards: Array<any>;

    sub: Subscription;
    constructor(private route: ActivatedRoute,
                private router: Router,
                private cardService: CardService) {
    }


    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.cardService.get(id).subscribe((card: any) => {
                    if (card) {
                        this.cards = card;
                        // this.cards.href = car._links.self.href;
                    } else {
                        console.log(`Card with id '${id}' not found, returning to list`);
                        this.gotoList();
                    }
                });
            }
        });
        /*
        this.cardService.get(id).subscribe(data => {
            this.cards = data;
        });
        */
    }

    gotoList() {
        this.router.navigate(['/card-list']);
    }

}
