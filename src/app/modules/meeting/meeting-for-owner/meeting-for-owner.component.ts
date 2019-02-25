import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Meeting} from '@app/core/models/meeting.model';
import {MeetingService} from '@app/core/services/meeting.service';
import {AuthService} from '@app/core';
import {FormControl} from '@angular/forms';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {MetadataOverride} from '@angular/core/testing';
import {MessageService} from '@app/core/services/message.service';
import {ChatService} from '@app/core/services/chat.service';
import {MatPaginator, MatTableDataSource, MatSort, MatCheckbox} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Subscription} from 'rxjs';
import {Chat} from '@app/core/models/chat.model';



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
  private meeting = {} as Meeting;
  private date;
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

    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.meetingService.getMeeting(id).subscribe((meeting: any) => {
          if (meeting) {
            this.meetingService.setMeeting(meeting);
            this.meeting = meeting;
            this.date = meeting.dateOfMeeting;
            this.meetingService.getParticipants().subscribe(data => {
              this.participants = data;
              console.log(data);
            });
            this.route.params = this.chatService.getChannel(-7);
            super.ngOnInit();
            this.delay(2000).then(any => {
              super.scrollToBottom();
            });
          } else {
            console.log(`Card with id '${id}' not found, returning to list`);
          }
        });
      }
    });
  }


  ngOnInit() {

    //this.chatService.setChannel(this.meeting.meetingChat);

    //this.route.params(this.meeting.meetingChat.id);
    let chat = {id: -7, chatName: 'meeting chat'} as Chat;

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
