import { Component, OnInit } from '@angular/core';
import {AuthService, MessageService} from '@app/core';
import {Router} from '@angular/router';
import {Check} from '@app/core/models/check.model';
import {CheckService} from '@app/core/services/check.service';
import {MatTabChangeEvent} from '@angular/material';
import {ConfirmationService, MessageService as mes} from 'primeng/api';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css'],
  providers: [mes, ConfirmationService]
})
export class CheckListComponent implements OnInit {

    checksToPay: Check[] = [];
    checksHistory: Check[] = [];
    checksFromOwners: Check[] = [];
    displayDialogToMarkAsPayed: boolean;
    check: Check;

  constructor(private authService: AuthService,
              private router: Router,
              private checkService: CheckService,
              private messService: mes) {
      this.displayDialogToMarkAsPayed = false;
  }

  ngOnInit() {
      this.checkService.getAll('notpayed').subscribe( data => {
          this.checksToPay = data;
          this.checksToPay = this.checksToPay.sort((a, b): number => {
              if (a.id < b.id) {return 1; }
              return 0; });
          console.log(data);
          });
  }

    parse(value: any): String | null {
        if ((typeof value === 'string')) {
            const str = value.split('-');
            const year = Number(str[0]);
            const month = Number(str[1]) - 1;
            const date = Number(str[2].charAt(0) + str[2].charAt(1)) + 1;
            return new Date(year, month, date).toString().substr(0, 15 );
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp).toString().substr(0, 15 );
    }

    loadChecksFromOwners(tab: MatTabChangeEvent) {
        if (tab.index === 1 && !this.checksFromOwners.length) {

        }
        if (tab.index === 2 ) {
            this.checkService.getAll('payed').subscribe( data => {
                this.checksFromOwners = data;
                this.checksFromOwners = this.checksToPay.sort((a, b): number => {
                    if (a.id < b.id) {return 1; }
                    return 0; });
                console.log(data);
            });
        }
    }

    openCheck(check: Check) {
        this.router.navigate(['/check-list/check-to-pay-info', check.id])
            .catch(reason => console.log('ups') );
    }

    markAsPayed() {
      this.messService.add({severity:'success', summary: 'Success Message', detail:'Check added to payed'});
    }

    fixCheck(check: Check) {
      console.log('here');
      this.check = check;
      this.displayDialogToMarkAsPayed = true;
    }
}
