import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService, CardService, CheckService} from '@app/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Card} from '@app/core/models/card.model';
import {MessageService as mes} from 'primeng/api';

@Component({
  selector: 'app-check-pay',
  templateUrl: './check-pay.component.html',
  styleUrls: ['./check-pay.component.css']
})
export class CheckPayComponent implements OnInit {
    private check = null;
    sub: Subscription;

    card = {} as Card;
    cards: Array<Card> = null;
    showAddCard: boolean = false;
    CVV: number;
    lastFourNumbers: number;
    fixedCardId: number = null;

  constructor(private authService: AuthService,
              private router: Router,
              private checkService: CheckService,
              public route: ActivatedRoute,
              private messService: mes,
              private cardService: CardService) { }

  ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
          const id = params['id'];
          if (id) {
              this.checkService.getCheck(id).subscribe(res => {
                  console.log(res);
                  if (res) {
                      this.check = res;
                  }
              });
          }
      });

      this.cardService.getAll(this.authService.user.id).subscribe(data => {
          if (data) {
              this.cards = data;
          } else {
              this.cards = [];
          }
      });
  }

    setCard(card: any) {
        this.fixedCardId = card.id;
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms))
            .then();
    }


    markAsPayed() {
        this.checkService.confirmParticipation(this.check.id).subscribe(res => {
            this.messService.add({severity: 'success', summary: 'Success Message', detail: 'Check payed'});
            this.delay(900).then(any => {
                this.router.navigate(['/check-list']);
            });
        });
    }

    saveCard() {
        if ((this.lastFourNumbers.toString().length !== 16) || (this.lastFourNumbers.toString().includes('.'))) {
            this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid card number'});
        } else if (!this.card.nameSurname.includes(' ') || (this.card.nameSurname.indexOf(' ') ===
            (this.card.nameSurname.length - 1))) {
            this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid name on card'});
        } else if (this.CVV.toString().length !== 3) {
            this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid CVV'});
        } else {
            this.card.lastFourNumbers = this.lastFourNumbers.toString();
            this.card.owner = this.authService.user;
            this.cardService.save(this.card).subscribe(result => {
                //this.card = null;
                this.cards.push(result);
                this.showAddCard = false;
                this.messService.add({severity: 'success', summary: 'Success Message', detail:'Card added'});
            }, error => console.error(error));
        }
    }

}
