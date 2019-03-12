import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Meeting} from '@app/core/models/meeting.model';
import {MeetingService} from '@app/core/services/meeting.service';
import {AuthService, Participant, Place} from '@app/core';
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
import {Bill} from '@app/core/models/bill.model';
import {CheckService} from '@app/core/services/check.service';
import {Meetinglocation} from '@app/core/models/meetinglocation';
import {PollService} from '@app/core/services/poll.service';
import {DatePoll} from '@app/core/models/datepoll.model';



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

declare var google: any;

@Component({
  selector: 'app-meeting-for-owner',
  templateUrl: './meeting-for-owner.component.html',
  styleUrls: ['./meeting-for-owner.component.css'],
  providers: [mes]
})
export class MeetingForOwnerComponent extends MessagesComponent implements OnInit {

    placePoll: Meetinglocation[];
    datePoll: DatePoll[];

    openMap: boolean;
    options: any;
    overlays: any[];
    dialogVisible: boolean;
    markerTitle: string;
    selectedPosition: any;
    infoWindow: any;


    private bill = {} as Bill;
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
  time: Date;
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

    parseTime(value: any): Date|null {
        if ((typeof value === 'string')) {
            let str = value.split('T');
            str = str[1].split(':');
            let hour = Number(str[0]) + 3;
            const min = Number(str[1]);
            if (hour >= 24) {
                hour = hour - 24;
            }
            let myDate = new Date();
            myDate.setHours(hour);
            myDate.setMinutes(min);
            return myDate;
        }
        return null;
    }

  constructor(private messService: mes,
              private meetingService: MeetingService,
              public route: ActivatedRoute,
              authService: AuthService,
              public router: Router,
              messageService: MessageService,
              public chatService: ChatService,
              private checkService: CheckService,
              private pollService: PollService) {
    super(messageService, router, chatService, authService, route);
    const users: UserData[] = [];
    for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);

    this.placePoll = null;
    this.datePoll = null;
    this.targetCars = [];
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.meetingService.getByParticipant(id).subscribe((participant: any) => {
          if (participant) {
            this.participant = participant;
            this.meetingService.setParticipant(participant);

              this.meetingService.getMeeting(this.participant.participantOfMeeting.id).subscribe((meeting: any) => {
                  if (meeting) {
                      console.log(meeting);
                      this.meeting = meeting;
                      this.meetingService.setMeeting(meeting);
                      if (this.meeting.pollForPlaceOpen === 0) {
                          this.pollService.getPlacePoll(this.meeting.id).subscribe(poll => {
                              this.placePoll = poll;
                          });
                      }

                      this.meetingService.getBill(meeting.id).subscribe(item => {
                          console.log(item);
                         this.bill = item;
                      if (this.bill.billStatus !== 'empty') {
                          this.meetingService.getParticipantItems().subscribe(items => {
                              console.log('here');
                              this.myList = items;
                              this.myList.forEach(itemAmount => {
                                  itemAmount.billItemAmount.itemCurrentAmount = itemAmount.amountInCheck;
                                  this.targetCars.push(itemAmount.billItemAmount);
                              });
                              this.targetCars = this.targetCars.sort((a, b): number => {
                                  if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                                  if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                                  return 0; });
                              console.log(items);
                          });

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
                                  if (item.itemCurrentAmount > 0) {
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
                      } else {
                          console.log('empty bill');
                          this.billItems = [];
                          this.sourceCars = [];
                          this.targetCars = [];
                      }
                  });
                      const today = new Date();
                      const month = today.getMonth();
                      const year = today.getFullYear();
                      this.minDate = new Date();
                      this.minDate.setMonth(month);
                      this.minDate.setFullYear(year);
                      if (this.meeting.meetingDescription) {
                          let re = /\\n/gi;
                          this.meeting.meetingDescription = this.meeting.meetingDescription.replace(re,' ');
                          re = /\"/gi;
                          this.meeting.meetingDescription = this.meeting.meetingDescription.replace(re,'');
                      }
                      // this.date = new Date().to;
                      if (this.meeting.dateOfMeeting) {
                          this.date = this.parse(this.meeting.dateOfMeeting.toString());
                      }
                      if (this.meeting.timeOfMeeting) {
                          this.time = this.parseTime(this.meeting.timeOfMeeting.toString());
                      }
                      this.meetingService.getParticipants().subscribe(data => {
                          this.participants = data;
                          console.log(data);
                      });
                      this.route.params = this.chatService.getChannel(this.meeting.meetingChat.id);
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
      this.openMap = false;
      this.options = {
          center: {lat: 51.6754966, lng: 39.2088823},
          zoom: 12
      };

      this.infoWindow = new google.maps.InfoWindow();
      if (!this.overlays || !this.overlays.length) {
          this.overlays = [];
      }


      this.cols = [
          { field: 'itemTitle', header: 'item' },
          { field: 'price', header: 'price' },
          { field: 'itemAmount', header: 'amount' },
          { field: 'itemCurrentAmount', header: 'left' },
      ];
    // this.chatService.setChannel(this.meeting.meetingChat);

    // this.route.params(this.meeting.meetingChat.id);



     //this.route.params = this.chatService.getChannel(-7);

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

    changeTime() {
        console.log(this.time);
        this.meetingService.setTime(this.time, this.meeting.id);
        this.messService.add({severity:'success', summary: 'Success Message', detail:'Time changed'});
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
      const reserv =  {} as Item;
      reserv.itemCurrentAmount = item.itemCurrentAmount;
      reserv.itemAmount = item.itemAmount;
      console.log("out");
      console.log(item);
      item.itemAmount = 0;
      item.itemCurrentAmount = -1;
      this.meetingService.updateItem(item).subscribe(
          res => {
              console.log(res);
              let tmp = this.billItems.find(it => it.id === res.id);
              tmp.itemCurrentAmount = res.itemCurrentAmount;
              tmp.itemAmount = res.itemAmount;
              tmp.price = res.price;
              if (this.targetCars.find(it => it.id === res.id)) {
                  // item.itemCurrentAmount++;
                  this.targetCars.find( it => it.id === res.id).itemCurrentAmount
                      = this.targetCars.find(it => it.id === res.id).itemCurrentAmount + 1;
                  // this.targetCars = this.targetCars.filter(it => it.id !== item.id);
                  // this.targetCars.push(item);
                  this.targetCars = this.targetCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  // this.targetCars.push(item);
              } else {
                  const newitem = {} as Item;
                  newitem.itemAmount = res.itemAmount ;
                  newitem.itemCurrentAmount = 1;
                  newitem.itemTitle = res.itemTitle;
                  newitem.id = res.id;
                  newitem.itemBill = res.itemBill;
                  newitem.price = res.price;
                  this.targetCars.push(newitem);
                  this.targetCars = this.targetCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
              }
              if (res.itemCurrentAmount > 0) {
                  const newitem = {} as Item;
                  newitem.itemAmount = res.itemCurrentAmount ;
                  newitem.itemCurrentAmount = 0;
                  newitem.itemTitle = res.itemTitle;
                  newitem.id = res.id;
                  newitem.itemBill = res.itemBill;
                  newitem.price = res.price;
                  this.sourceCars.push(newitem);
                  this.sourceCars = this.sourceCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  // this.sourceCars = this.sourceCars.filter(it => it.id !== item.id);
              }
          },
          (err: HttpErrorResponse) => {
              console.log(err.status);
              if (err.status === 409) {
                  this.messService.add({
                      severity: 'error',
                      summary: 'Error Message',
                      detail: 'wrong amount'
                  });
                  //this.targetCars.pop();
              }
              else {
                  this.messService.add({severity: 'error', summary: 'Error Message', detail: 'impossible to add'});
                  this.sourceCars.push(reserv);
                  this.sourceCars = this.sourceCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
              }
          }
      );
  }

  deleteFromMyCheck() {
      this.changed_bill = true;
      const item = this.sourceCars.pop();
      const reserv =  {} as Item;
      reserv.itemCurrentAmount = item.itemCurrentAmount;
      reserv.itemAmount = item.itemAmount;
      //this.billItems.find(it => it.id === item.id).itemAmount = 0;
      //this.billItems.find(it => it.id === item.id).itemCurrentAmount = 1;
      item.itemAmount = 0;
      item.itemCurrentAmount = 1;
      this.meetingService.updateItem(item).subscribe(
          res => {
              console.log(res);
              let tmp = this.billItems.find(it => it.id === res.id);
              tmp.itemCurrentAmount = res.itemCurrentAmount;
              tmp.itemAmount = res.itemAmount;
              tmp.price = res.price;
              //this.sourceCars.push(tmp);
              if (this.sourceCars.find(it => it.id === res.id)) {
                  // item.itemCurrentAmount++;
                  this.sourceCars.find(it => it.id === res.id).itemAmount = res.itemCurrentAmount;
                  // this.targetCars = this.targetCars.filter(it => it.id !== item.id);
                  // this.targetCars.push(item);
                  this.sourceCars = this.sourceCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  // this.targetCars.push(item);
              } else {
                  let newitem = {} as Item;
                  newitem.itemAmount = res.itemCurrentAmount ;
                  newitem.itemCurrentAmount = 0;
                  newitem.itemTitle = res.itemTitle;
                  newitem.id = res.id;
                  newitem.itemBill = res.itemBill;
                  newitem.price = res.price;
                  this.sourceCars.push(newitem);
                  this.sourceCars = this.sourceCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
              }
              //this.billItems.find(it => it.id === res.id).itemCurrentAmount++;
              if (reserv.itemCurrentAmount > 1) {
                  let newitem = {} as Item;
                  newitem.itemCurrentAmount = reserv.itemCurrentAmount - 1 ;
                  newitem.itemAmount = 0;
                  newitem.itemTitle = res.itemTitle;
                  newitem.id = res.id;
                  newitem.itemBill = res.itemBill;
                  newitem.price = res.price;
                  this.targetCars.push(newitem);
                  this.targetCars = this.targetCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
                  // this.sourceCars = this.sourceCars.filter(it => it.id !== item.id);
              } else {
                  this.meetingService.deleteItemFromCheck(res.id, this.participant.id).subscribe(
                      (err: HttpErrorResponse) => {
                          console.log(err.status);
                      }
                  );
              }
          },
          (err: HttpErrorResponse) => {
              //this.billItems.find(it => it.id === item.id).itemCurrentAmount--;
              console.log(err.status);
              if (err.status === 409) {
                  this.messService.add({
                      severity: 'error',
                      summary: 'Error Message',
                      detail: 'wrong amount'
                  });
                   if (this.targetCars.find(it => it.id === item.id)) {
                      this.targetCars.pop();
                      this.targetCars.push(item);
                   }
              } else {
                  this.messService.add({severity: 'error', summary: 'Error Message', detail: 'impossible to delete'});
                  this.targetCars.push(reserv);
                  this.targetCars = this.targetCars.sort((a, b): number => {
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1; }
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1; }
                      return 0; });
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
        //let itemsForUpdate = this.targetCars.filter(item => item.itemCurrentAmount!==0)
        console.log(this.targetCars);
        this.meetingService.checkUpdate(this.targetCars, this.participant.id).subscribe(res => {
            console.log(res);
        });
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
      this.car.itemCurrentAmount = 0;
      if (this.car.price < 0) {
          this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid price'});
          if (this.car.itemAmount <= 0) {
              this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid amount'});
          }
      } else if (this.car.itemAmount <= 0) {
          this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid amount'});
      } else {
          let cars = [...this.billItems];
          if (this.newCar) {
              this.meetingService.addItem(this.car).subscribe(
                  res => {
                      cars.push(res);
                      console.log(res);
                      this.billItems.push(res);
                      let tmpItem = {} as Item;
                      tmpItem.itemAmount = res.itemCurrentAmount;
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
                      this.meetingService.getBill(this.meeting.id).subscribe(item => {
                          console.log(item);
                          this.bill = item;
                      });
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
                      tmpItem.itemAmount = res.itemCurrentAmount;
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
                      this.meetingService.getBill(this.meeting.id).subscribe(item => {
                          console.log(item);
                          this.bill = item;
                      });
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
                              detail: 'the amount can\'t be less then already in lists'
                          });
                      }
                      if (err.status === 403) {
                          this.messService.add({
                              severity: 'error',
                              summary: 'Error Message',
                              detail: 'can\'t decrease amount. Someone already payed'
                          });
                      } else {
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
            this.meetingService.deleteItem(this.selectedCar.id).subscribe(
                res => {
                    this.billItems = this.billItems.filter(item => item.id !== this.selectedCar.id);
                    this.sourceCars = this.sourceCars.filter(item => item.id !== this.selectedCar.id);
                    this.car = null;
                    this.displayDialog = false;
                    this.messService.add({severity: 'success', summary: 'Success Message', detail: 'item deleted'});
                    this.meetingService.getBill(this.meeting.id).subscribe(item => {
                        console.log(item);
                        this.bill = item;
                    });
                    },
                (err: HttpErrorResponse) => {
                    //console.log(err.error);
                    //console.log(err.name);
                    //console.log(err.message);
                    console.log(err.status);
                    if (err.status === 409) {
                        this.messService.add({
                            severity: 'error',
                            summary: 'Error Message',
                            detail: 'can\'t delete. This item already in someones list'
                        });
                    } else if (err.status === 403) {
                        this.messService.add({
                            severity: 'error',
                            summary: 'Error Message',
                            detail: 'can\'t delete. Someone already payed'
                        });
                    } else {
                        this.messService.add({severity: 'error', summary: 'Error Message', detail: 'invalid values'});

                    }
                }
            );
        }
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

    handleMapClick(event) {
        this.dialogVisible = true;
        this.selectedPosition = event.latLng;
    }

    addMarker() {
        if (this.overlays) {
            this.overlays.pop();
        }
        this.overlays.push(new google.maps.Marker({position:{lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng()}, title:this.markerTitle, draggable: true}));
        //this.markerTitle = null;
        this.dialogVisible = false;
        let place = {} as Place;
        place.lat = this.selectedPosition.lat();
        place.lng = this.selectedPosition.lng();
        place.placeName = this.markerTitle;
        this.meeting.meetingLocation = place;
        this.meetingService.setLocation(place, this.meeting.id);
    }

    handleDragEnd(event) {
        this.messService.add({severity:'info', summary:'Marker Dragged', detail: event.overlay.getTitle()});
    }


    zoomIn(map) {
        map.setZoom(map.getZoom()+1);
    }

    zoomOut(map) {
        map.setZoom(map.getZoom()-1);
    }

    clear() {
        this.overlays = [];
    }

    // parseCheck() {
    //   this.checkService.parseCheck('8710000101914246',
    //       '0000073341', '2947395005')
    //       .subscribe(res => {
    //           console.log(res);
    //       });
    // }
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
