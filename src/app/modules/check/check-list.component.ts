import { Component, OnInit } from '@angular/core';
import {AuthService, MessageService} from '@app/core';
import {Router} from '@angular/router';
import {Check} from '@app/core/models/check.model';
import {CheckService} from '@app/core/services/check.service';
import {MatTabChangeEvent} from '@angular/material';
import { MessageService as mes} from 'primeng/api';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css'],
  providers: [mes]
})
export class CheckListComponent implements OnInit {

    index: number = 0;
    myId: number;
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
      this.myId = this.authService.user.id;
  }

  ngOnInit() {
      this.checkService.getAll('notpayed').subscribe( data => {
          if (data !== null) {
              this.checksToPay = data;
              this.checksToPay = this.checksToPay.sort((a, b): number => {
                  if (a.id < b.id) {
                      return -1;
                  }
                  if (a.id > b.id) {
                      return 1;
                  }
                  return 0;
              });
              console.log(data);
          }
      });
  }

    openList(num: number) {
        if (num === 1 && !this.checksFromOwners.length) {
            this.checkService.getOwedChecks('notpayed').subscribe( data => {
                if (data !== null) {
                    this.checksFromOwners = data;
                    this.checksFromOwners = this.checksFromOwners.sort((a, b): number => {
                        if (a.id > b.id) {
                            return -1;
                        }
                        if (a.id < b.id) {
                            return 1;
                        }
                        return 0;
                    });
                    console.log(data);
                }
            });
        }
        if (num === 2 && !this.checksHistory.length) {
            this.checkService.getAll('payed').subscribe( data => {
                if (data !== null) {
                    this.checksHistory = data;
                    this.checkService.getOwedChecks('payed').subscribe(res => {
                        res.forEach(item => {this.checksHistory.push(item); });
                        this.checksHistory = this.checksHistory.sort((a, b): number => {
                            if (a.id > b.id) {
                                return -1;
                            }
                            if (a.id < b.id) {
                                return 1;
                            }
                            return 0;
                        });
                    });
                } else {
                    this.checkService.getOwedChecks('payed').subscribe(res => {
                        if (res !== null) {
                            this.checksHistory = res;
                            this.checksHistory = this.checksHistory.sort((a, b): number => {
                                if (a.id > b.id) {
                                    return -1;
                                }
                                if (a.id < b.id) {
                                    return 1;
                                }
                                return 0;
                            });
                        }
                    });
                }
            });
        }
        this.index = num;
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

    loadChecks(tab: MatTabChangeEvent) {
        if (tab.index === 1 && !this.checksFromOwners.length) {
            this.checkService.getOwedChecks('notpayed').subscribe( data => {
                if (data !== null) {
                    this.checksFromOwners = data;
                    this.checksFromOwners = this.checksFromOwners.sort((a, b): number => {
                        if (a.id > b.id) {
                            return -1;
                        }
                        if (a.id < b.id) {
                            return 1;
                        }
                        return 0;
                    });
                    console.log(data);
                }
            });
        }
        if (tab.index === 2 && !this.checksHistory.length) {
            this.checkService.getAll('payed').subscribe( data => {
                if (data !== null) {
                    this.checksHistory = data;
                    this.checkService.getOwedChecks('payed').subscribe(res => {
                        res.forEach(item => {this.checksHistory.push(item); });
                        this.checksHistory = this.checksHistory.sort((a, b): number => {
                            if (a.id > b.id) {
                                return -1;
                            }
                            if (a.id < b.id) {
                                return 1;
                            }
                            return 0;
                        });
                    });
                } else {
                    this.checkService.getOwedChecks('payed').subscribe(res => {
                        if (res !== null) {
                            this.checksHistory = res;
                            this.checksHistory = this.checksHistory.sort((a, b): number => {
                                if (a.id > b.id) {
                                    return -1;
                                }
                                if (a.id < b.id) {
                                    return 1;
                                }
                                return 0;
                            });
                        }
                    });
                }
            });
        }
    }

    openCheck(check: Check) {
        this.router.navigate(['/check-list/check-info', check.id])
            .catch(reason => console.log('ups') );
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms))
            .then();
    }

    markAsPayed() {
      this.checkService.confirmParticipation(this.check.id).subscribe(res => {
          this.messService.add({severity: 'success', summary: 'Success Message', detail: 'Check added to payed'});
          this.delay(600).then(any => {
              window.location.reload();
          });
         });
      }

    fixCheck(check: Check) {
      console.log('here');
      this.check = check;
      this.displayDialogToMarkAsPayed = true;
    }
}
