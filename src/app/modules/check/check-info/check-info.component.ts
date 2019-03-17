import { Component, OnInit } from '@angular/core';
import {AuthService, Participant} from '@app/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CheckService} from '@app/core/services/check.service';
import {MessageService as mes} from 'primeng/api';
import {Check} from '@app/core/models/check.model';
import {Subscription} from 'rxjs';
import {ItemAmount} from '@app/core/models/itemamount.model';
import {HttpErrorResponse} from '@angular/common/http';
import {Card} from '@app/core/models/card.model';

@Component({
  selector: 'app-check-info',
  templateUrl: './check-info.component.html',
  styleUrls: ['./check-info.component.css']
})
export class CheckInfoComponent implements OnInit {
    private check = null;
    sub: Subscription;
    items: ItemAmount[] = [];
    myId: number;
    cols: any[];


  constructor(private authService: AuthService,
              private router: Router,
              private checkService: CheckService,
              private messService: mes,
              public route: ActivatedRoute) {

  }

  ngOnInit() {
    // this.cols = [
    //     { field: 'item', header: 'Item' },
    //     {field: 'amount', header: 'Amount' },
    //     { field: 'price', header: 'Price' }
    // ];
      this.sub = this.route.params.subscribe(params => {
          const id = params['id'];
          if (id) {
              this.checkService.getCheck(id).subscribe(res => {
                  console.log(res);
                  if (res) {
                      this.check = res;
                      this.checkService.getItems(this.check.id).subscribe(data => {
                              if (data) {
                                  console.log(res);
                                  this.items = data;
                              } else {
                                  this.items = null;
                              }
                          },
                          (err: HttpErrorResponse) => {
                              console.log(err.status);
                          }
                      );
                  }
              });
          }
      });
      this.myId = this.authService.user.id;
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
}
