import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Meeting} from '@app/core/models/meeting.model';
import {MeetingService} from '@app/core/services/meeting.service';
import {AuthService, Participant} from '@app/core';
import {FormControl} from '@angular/forms';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {MetadataOverride} from '@angular/core/testing';
import {MessageService} from '@app/core/services/message.service';
import {ChatService} from '@app/core/services/chat.service';
import {MatPaginator, MatTableDataSource, MatSort, MatCheckbox} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Subscription} from 'rxjs';
import {Chat} from '@app/core/models/chat.model';
import {Item} from '@app/core/models/item.model';
import {ItemAmount} from '@app/core/models/itemamount.model';
import {Message} from 'primeng/api';
import {MessageService as mes} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';



/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  price: number;
  amount: number;
  highlighted?: boolean;
  hovered?: boolean;
  inCart: number;
}

@Component({
  selector: 'app-meeting-for-owner',
  templateUrl: './meeting-for-owner.component.html',
  styleUrls: ['./meeting-for-owner.component.css'],
  providers: [mes]

})
export class MeetingForOwnerComponent extends MessagesComponent implements OnInit {
    displayDialogDescription: boolean = false;
    editDescription: boolean = false;
    displayDialog: boolean;
    car: Item = {} as Item;
    selectedCar: Item;
    newCar: boolean;
    cols: any[];
    billItems: Item[];

    sourceCars: Item[];
    targetCars: Item[];
    myList: ItemAmount[];

    private your_list;
    private show_bill;
    private edit_bill;
    private changed_bill;

  private participant = {} as Participant;
  private meeting = {} as Meeting;
  private date: Date;
  private minDate: Date;
  mark_info = true;
  private participants: Array<any>;
  sub: Subscription;

  checked = false;
  indeterminate = false;
  labelPosition = 'after';
  disabled = false;

  selection = new SelectionModel<UserData>(true, []);

  displayedColumns = ['checked', 'inCart', 'name', 'price', 'amount'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatCheckbox) checkbox: MatCheckbox;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

    parse(value: any): Date | null {
        if ((typeof value === 'string')) {
            const str = value.split('-');
            const year = Number(str[0]);
            const month = Number(str[1]) - 1;
            const date = Number(str[2].charAt(0) + str[2].charAt(1)) + 1;
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

  constructor(private messService: mes,
              private meetingService: MeetingService,
              public route: ActivatedRoute,
              authService: AuthService,
              public router: Router,
              messageService: MessageService,
              public chatService: ChatService) {
    super(messageService, router, chatService, authService, route);
    const users: UserData[] = [];
    for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);

    this.targetCars = [];
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.meetingService.getByParticipant(id).subscribe((participant: any) => {
          if (participant) {
            this.participant = participant;
            this.meetingService.setParticipant(participant);
              this.meetingService.getParticipantItems().subscribe(items => {
                  console.log('here');
                  this.myList = items;
                  this.myList.forEach(item => this.targetCars.push(item.billItemAmount));
                  this.targetCars = this.targetCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  console.log(items);
              });
              this.meetingService.getMeeting(this.participant.participantOfMeeting.id).subscribe((meeting: any) => {
                  if (meeting) {
                      this.meetingService.setMeeting(meeting);

                      this.meetingService.getAllItems().subscribe(items => {
                          this.billItems = items;
                          this.sourceCars = [];
                          this.billItems.forEach(item => {
                              let tmpItem = {} as Item;
                              tmpItem.id = item.id;
                              tmpItem.itemCurrentAmount = 0;
                              tmpItem.itemAmount = item.itemCurrentAmount;
                              tmpItem.itemTitle = item.itemTitle;
                              tmpItem.price = item.price;
                              tmpItem.itemBill = item.itemBill;
                              if(item.itemCurrentAmount > 0) {
                                  this.sourceCars.push(tmpItem);
                              }
                          });

                          // this.sourceCars.forEach(item => {
                          //     item.itemAmount = item.itemCurrentAmount;
                          //     item.itemCurrentAmount = 0;
                          // });
                          this.sourceCars = this.sourceCars.sort((a, b): number => {
                              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                              return 0; });
                          // this.sourceCarsInfo = items;
                          console.log(items);
                      });
                      this.meeting = meeting;
                      const today = new Date();
                      const month = today.getMonth();
                      const year = today.getFullYear();
                      this.minDate = new Date();
                      this.minDate.setMonth(month);
                      this.minDate.setFullYear(year);
                      let re = /\\n/gi;
                      this.meeting.meetingDescription = this.meeting.meetingDescription.replace(re,' ');
                      re = /\"/gi;
                      this.meeting.meetingDescription = this.meeting.meetingDescription.replace(re,'');
                      // this.date = new Date().to;
                      this.date = this.parse(this.meeting.dateOfMeeting.toString());
                      this.meetingService.getParticipants().subscribe(data => {
                          this.participants = data;
                          console.log(data);
                      });
                      this.route.params = this.chatService.getChannel(-7);
                      super.ngOnInit();
                      this.delay(2000).then(any => {
                          super.scrollToBottom();
                      });
                  }
              });
              }
          });
      } else {
            console.log(`Card with id '${id}' not found, returning to list`);
          }
        });
  }


  ngOnInit() {

      this.your_list = false;
      this.edit_bill = false;
      this.show_bill = true;
      this.changed_bill = false;

      this.cols = [
          { field: 'itemTitle', header: 'item' },
          { field: 'price', header: 'price' },
          { field: 'itemAmount', header: 'amount' },
          { field: 'itemCurrentAmount', header: 'left' },
      ];
    // this.chatService.setChannel(this.meeting.meetingChat);

    // this.route.params(this.meeting.meetingChat.id);



    // this.route.params = this.chatService.getChannel(-7);

    // this.meeting = this.meetingService.getCurrentMeeting();
    // this.date = this.meeting.dateOfMeeting;
    // this.meetingService.getParticipants().subscribe(data => {
    //   this.participants = data;
    //   console.log(data);
    // });

  }

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}


  changeDate() {
    const newDate = new Date();
    console.log(this.date);
    this.meetingService.setDate(this.date, this.meeting.id);
    this.messService.add({severity:'success', summary: 'Success Message', detail:'Date changed'});
 }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  askAmount(opt: UserData) {
    const def_amount = 1;
    if (opt.amount > def_amount) {
      console.log(opt.amount + 'amount?');
    }
    console.log('added');
  }

  highlight(element: UserData) {
    element.highlighted = !element.highlighted;
  }

  arrayOne(n: number, startFrom: number): number[] {
    return [...Array.from(Array(n).keys())].map(i => i + startFrom);
  }

  changeAmount(element: UserData, i: number) {
    element.inCart = i;
    if (i === 0) {
      element.highlighted = false;
    } else {
      element.highlighted = true;
      for (let data of this.dataSource.data) {
        if (data.id === element.id) {
          data = element;
        }
      }
    }
  }

  addToMyCheck() {
      this.changed_bill = true;
      const item = this.targetCars.pop();
      this.billItems.find(it => it.id === item.id).itemCurrentAmount--;
      this.meetingService.updateItem(this.billItems.find(it => it.id === item.id)).subscribe(
          res => {
              console.log(res);
              if (this.targetCars.find(it => it.id === res.id)) {
                  // item.itemCurrentAmount++;
                  this.targetCars.find(it => it.id === res.id).itemCurrentAmount = this.targetCars.find(it => it.id === res.id).itemCurrentAmount + 1;
                  // this.targetCars = this.targetCars.filter(it => it.id !== item.id);
                  // this.targetCars.push(item);
                  this.targetCars = this.targetCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  // this.targetCars.push(item);
              } else {
                  item.itemCurrentAmount = 1;
                  this.targetCars.push(res);
                  this.targetCars = this.targetCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
              }
              if (res.itemAmount > 1) {
                  const newitem = {} as Item;
                  newitem.itemAmount = res.itemCurrentAmount ;
                  newitem.itemCurrentAmount = 0;
                  newitem.itemTitle = res.itemTitle;
                  newitem.id = res.id;
                  newitem.itemBill = res.itemBill;
                  newitem.price = res.price;
                  if (newitem.itemAmount > 0) {
                      this.sourceCars.push(newitem);
                  }
                  this.sourceCars = this.sourceCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  // this.sourceCars = this.sourceCars.filter(it => it.id !== item.id);
              }
          },
          (err: HttpErrorResponse) => {
              this.billItems.find(it => it.id === item.id).itemCurrentAmount++;
              console.log(err.status);
              if (err.status === 409) {
                  this.messService.add({
                      severity: 'error',
                      summary: 'Error Message',
                      detail: 'wrong amount'
                  });
              }
              else {
                  this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid values'});

              }
          }
      );
  }

  deleteFromMyCheck() {
      this.changed_bill = true;
      const item = this.sourceCars.pop();
      this.billItems.find(it => it.id === item.id).itemCurrentAmount++;
      this.meetingService.updateItem(this.billItems.find(it => it.id === item.id)).subscribe(
          res => {
              console.log(res);
              if (this.sourceCars.find(it => it.id === res.id)) {
                  // item.itemCurrentAmount++;
                  this.sourceCars.find(it => it.id === res.id).itemAmount = this.sourceCars.find(it => it.id === res.id).itemAmount + 1;
                  // this.targetCars = this.targetCars.filter(it => it.id !== item.id);
                  // this.targetCars.push(item);
                  this.sourceCars = this.sourceCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  // this.targetCars.push(item);
              } else {
                  res.itemAmount = 1;
                  const newitem = {} as Item;
                  newitem.itemAmount = res.itemCurrentAmount ;
                  newitem.itemCurrentAmount = 0;
                  newitem.itemTitle = res.itemTitle;
                  newitem.id = res.id;
                  newitem.itemBill = res.itemBill;
                  newitem.price = res.price;
                  this.sourceCars.push(res);
                  this.sourceCars = this.sourceCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
              }
              //this.billItems.find(it => it.id === res.id).itemCurrentAmount++;
              if (item.itemCurrentAmount > 1) {

                  this.targetCars.push(res);
                  this.targetCars = this.targetCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  // this.sourceCars = this.sourceCars.filter(it => it.id !== item.id);
              } else {
                  item.itemCurrentAmount--;
              }
          },
          (err: HttpErrorResponse) => {
              this.billItems.find(it => it.id === item.id).itemCurrentAmount--;
              console.log(err.status);
              if (err.status === 409) {
                  this.messService.add({
                      severity: 'error',
                      summary: 'Error Message',
                      detail: 'wrong amount'
                  });
              }
              else {
                  this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid values'});

              }
          }
      );
  }

    addNewItem() {
        this.changed_bill = true;
    }

    backToBill() {
      if (!this.changed_bill) {
          this.show_bill = true;
          this.edit_bill = false;
          this.your_list = false;
      } else {

      }
    }

    saveList() {
        this.changed_bill = false;
        this.messService.add({severity:'success', summary: 'Success Message', detail:'List saved'});
        //this.messService.add({severity:'error', summary: 'Error Message', detail:'failed'});
    }

    editBill() {
      this.edit_bill = true;
      this.show_bill = false;
    }

    saveBill() {
        this.changed_bill = false;
        //this.messService.add({severity:'error', summary: 'Error Message', detail:'failed'});
        this.messService.add({severity:'success', summary: 'Success Message', detail:'Bill saved'});
    }

    showYourList() {
        this.show_bill = false;
        this.your_list = true;
    }


    //show_bill
    showDialogToAdd() {
        this.newCar = true;
        this.car = {} as Item;
        this.displayDialog = true;
    }

    descriptionEdit() {
        this.displayDialogDescription = true;
    }

    descriptionSave() {
        console.log(this.meeting.meetingDescription);
       //this.meeting.meetingDescription = this.meeting.meetingDescription.substr(0);
        //this.meeting.meetingDescription = this.meeting.meetingDescription.substr(0,
          // this.meeting.meetingDescription.indexOf('\"') - 1);
        //console.log(this.meeting.meetingDescription);
        this.meetingService.setDescription(this.meeting.meetingDescription, this.meeting.id);
        this.messService.add({severity:'success', summary: 'Success Message', detail:'Description saved'});
    }

    save() {
      if (this.car.price < 0) {
          this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid price'});
          if (this.car.itemAmount <= 0) {
              this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid amount'});
          }
      } else if (this.car.itemAmount <= 0) {
          this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid amount'});
      } else {
          let cars = [...this.sourceCars];
          if (this.newCar) {

              this.meetingService.addItem(this.car).subscribe(
                  res => {
                      cars.push(res);
                      console.log(res);
                      this.billItems = cars;
                      this.sourceCars.push(res);
                      this.sourceCars.find(item => item.id = res.id).itemCurrentAmount = 0;
                      this.sourceCars = this.sourceCars.sort((a, b): number => {
                          if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {
                              return -1;
                          }
                          if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {
                              return 1;
                          }
                          return 0;
                      });
                      this.car = null;
                      this.displayDialog = false;
                  },
                  // (err: any) => {
                  //     if (err instanceof HttpErrorResponse) {
                  //         this.messService.add({severity: 'error', summary: 'Error Message', detail: ''});
                  //     }
                  // }
                  (err: HttpErrorResponse) => {
                      console.log(err.error);
                      console.log(err.name);
                      console.log(err.message);
                      console.log(err.status);
                      this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid values'});
                      this.car = null;
                      this.displayDialog = false;
                      return;
                  }
              );
          } else {
              console.log(this.car);
              this.meetingService.updateItem(this.car).subscribe(
                  res => {
                      console.log(res);
                      cars[this.billItems.indexOf(this.selectedCar)] = res;
                      this.billItems = cars;
                      this.sourceCars = this.sourceCars.filter(item => item.id !== res.id);
                      let tmpItem = {} as Item;
                      tmpItem.itemAmount = res.itemAmount;
                      tmpItem.itemTitle = res.itemTitle;
                      tmpItem.itemCurrentAmount = 0;
                      tmpItem.id = res.id;
                      tmpItem.price = res.price;
                      tmpItem.itemBill = res.itemBill;
                      this.sourceCars.push(tmpItem);
                      this.sourceCars = this.sourceCars.sort((a, b): number => {
                          if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {
                              return -1;
                          }
                          if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {
                              return 1;
                          }
                          return 0;
                      });
                      this.car = null;
                      this.displayDialog = false;
                  },
                  //  (err: any) => {
                  //     if (err instanceof HttpErrorResponse) {
                  //         this.messService.add({severity: 'error', summary: 'Error Message', detail: ''});
                  //     }
                  // }

                  (err: HttpErrorResponse) => {
                      //console.log(err.error);
                      //console.log(err.name);
                      //console.log(err.message);
                      console.log(err.status);
                      if (err.status === 409) {
                          this.messService.add({
                              severity: 'error',
                              summary: 'Error Message',
                              detail: 'the amount should be not less then already in lists'
                          });
                      }
                      else {
                          this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid values'});

                      }
                      this.car = null;
                      this.displayDialog = false;
                      return;
                  }
              );

          }
      }
    }

    delete() {
        if (!this.newCar) {
            this.meetingService.deleteItem(this.selectedCar.id);
        }
        let index = this.sourceCars.indexOf(this.selectedCar);
        this.billItems = this.billItems.filter((val, i) => i != index);
        this.sourceCars = this.sourceCars.filter((val, i) => i != index);
        this.car = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        this.newCar = false;
        this.car = this.cloneCar(event.data);
        this.displayDialog = true;
    }

    cloneCar(c: Item): Item {
        let car = {} as Item;
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}



/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    price: Math.round(Math.random() * 100 ),
    amount: Math.round(Math.random() * 100),
    inCart: 0
  };
}
