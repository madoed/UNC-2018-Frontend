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
  styleUrls: ['./meeting-for-owner.component.css']

})
export class MeetingForOwnerComponent extends MessagesComponent implements OnInit {
    sourceCars: Item[];
    sourceCarsInfo: Item[];
    targetCars: Item[];
    myList: ItemAmount[];

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
            const date = Number(str[2].charAt(0) + str[2].charAt(1))+1;
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

  constructor(private meetingService: MeetingService,

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
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1;}
                      if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1;}
                      return 0; });
                  console.log(items);
              });
              this.meetingService.getMeeting(this.participant.participantOfMeeting.id).subscribe((meeting: any) => {
                  if (meeting) {
                      this.meetingService.setMeeting(meeting);

                      this.meetingService.getAllItems().subscribe(items => {
                          this.sourceCars = items;
                          this.sourceCars = this.sourceCars.sort((a, b): number => {
                              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1;}
                              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1;}
                              return 0; });
                          this.sourceCars.forEach(item => {
                              item.itemAmount = item.itemCurrentAmount;
                              item.itemCurrentAmount = 0;
                          })
                          //this.sourceCarsInfo = items;
                          console.log(items);
                      });
                      this.meeting = meeting;
                      let today = new Date();
                      let month = today.getMonth();
                      let year = today.getFullYear();
                      this.minDate = new Date();
                      this.minDate.setMonth(month);
                      this.minDate.setFullYear(year);
                      //this.date = new Date().to;
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

    //this.chatService.setChannel(this.meeting.meetingChat);

    //this.route.params(this.meeting.meetingChat.id);



    //this.route.params = this.chatService.getChannel(-7);

    // this.meeting = this.meetingService.getCurrentMeeting();
    // this.date = this.meeting.dateOfMeeting;
    // this.meetingService.getParticipants().subscribe(data => {
    //   this.participants = data;
    //   console.log(data);
    // });

  }

/**
 * Set the paginator and sort after the view init since this component will
 * be able to query its view for the initialized paginator and sort.
 */
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}


  changeDate(){
    let newDate = new Date();
    console.log(this.date);
    this.meetingService.setDate(this.date, this.meeting.id);
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
      let item = this.targetCars.pop();
      if (this.targetCars.find(it => it.id === item.id)) {
          //item.itemCurrentAmount++;
          this.targetCars.find(it => it.id === item.id).itemCurrentAmount = this.targetCars.find(it => it.id === item.id).itemCurrentAmount+1;
         // this.targetCars = this.targetCars.filter(it => it.id !== item.id);
          //this.targetCars.push(item);
          this.targetCars = this.targetCars.sort((a, b): number => {
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1;}
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1;}
              return 0; });
          //this.targetCars.push(item);
      } else {
          item.itemCurrentAmount = 1;
          this.targetCars.push(item);
          this.targetCars = this.targetCars.sort((a, b): number => {
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1;}
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1;}
              return 0; });
      }
      if (item.itemAmount !== 1) {
          let newitem = {} as Item;
          newitem.itemAmount = item.itemAmount-1;
          newitem.itemCurrentAmount = 0;
          newitem.itemTitle = item.itemTitle;
          newitem.id = item.id;
          newitem.itemBill = item.itemBill;
          newitem.price = item.price;
          this.sourceCars.push(newitem);
          this.sourceCars = this.sourceCars.sort((a, b): number => {
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1;}
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1;}
              return 0; });
          //this.sourceCars = this.sourceCars.filter(it => it.id !== item.id);
      }
  }


  deleteFromMyCheck() {
      let item = this.sourceCars.pop();
      if (this.sourceCars.find(it => it.id === item.id)) {
          //item.itemCurrentAmount++;
          this.sourceCars.find(it => it.id === item.id).itemAmount = this.sourceCars.find(it => it.id === item.id).itemAmount + 1;
          // this.targetCars = this.targetCars.filter(it => it.id !== item.id);
          //this.targetCars.push(item);
          this.sourceCars = this.sourceCars.sort((a, b): number => {
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1;}
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1;}
              return 0; });
          //this.targetCars.push(item);
      } else {
          item.itemAmount = 1;
          this.sourceCars.push(item);
          this.sourceCars = this.sourceCars.sort((a, b): number => {
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1;}
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1;}
              return 0; });
      }
      if (item.itemCurrentAmount !== 1) {
          item.itemCurrentAmount--;
          this.targetCars.push(item);
          this.targetCars = this.targetCars.sort((a, b): number => {
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return -1;}
              if (a.itemTitle.substr(0, 1) < b.itemTitle.substr(0, 1)) {return 1;}
              return 0; });
          //this.sourceCars = this.sourceCars.filter(it => it.id !== item.id);
      } else {
          item.itemCurrentAmount--;
      }
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
