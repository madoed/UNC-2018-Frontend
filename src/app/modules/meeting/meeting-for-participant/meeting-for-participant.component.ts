import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {UserData} from '@app/modules/meeting/meeting-for-owner/meeting-for-owner.component';
import {MessageService as mes} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {
    Meeting,
    MeetingService,
    AuthService,
    Participant,
    Place,
    User,
    MessageService,
    ChatService,
    Item,
    ItemAmount,
    Bill,
    CheckService,
    Meetinglocation,
    PollService,
    DatePoll,
    FnsReceipt,
    FnsCheckInfo,
    FnsCheckService, CardService
} from '@app/core';
import {environment} from '@env';
import {Card} from '@app/core/models/card.model';

declare var google: any;

@Component({
  selector: 'app-meeting-for-participant',
  templateUrl: './meeting-for-participant.component.html',
  styleUrls: ['./meeting-for-participant.component.css'],
    providers: [mes]
})
export class MeetingForParticipantComponent extends MessagesComponent implements OnInit {
    defaultMeeting = environment.defaultMeeting;
    defaultAvatar = environment.defaultAvatar;

    showAddCardForFNS: boolean = false;
    showNewCard: boolean = false;

    card = {} as Card;
    cards: Array<Card> = null;
    showAddCard: boolean = false;
    CVV: number;
    lastFourNumbers: number;
    fixedCardId: number = null;

    meetingDescript: string = '';
    dateForVote: Date;

    showAddParticipants: boolean = false;
    users: Array<any>;
    fixedUserId;
    fixedUser: User;

    overlaysPollPopUp: any[];
    me = {} as User;
    placePoll: Meetinglocation[];
    datePoll: DatePoll[];
    showMap: boolean = false;
    overlaysPoll: any[];
    markerTitle2: string;

    openMap: boolean;
    options: any;
    overlays: any[];
    dialogVisible: boolean;
    markerTitle: string;
    selectedPosition: any;
    infoWindow: any;


    public bill = {} as Bill;
    displayDialogDescription: boolean = false;
    editDescription: boolean = false;
    displayDialog: boolean;
    car: Item = {} as Item;
    selectedCar: Item;
    newCar: boolean;
    cols: any[];
    billItems: Item[] = [];

    sourceCars: Item[];
    targetCars: Item[];
    myList: ItemAmount[];

    private your_list;
    private show_bill;
    private edit_bill;
    private changed_bill;

    displayFnsDialog: boolean = false;
    fnsCheckInfo: FnsCheckInfo = {} as FnsCheckInfo;

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

    parserMeeting(value: any): String | '' {
        if ((typeof value === 'string')) {
            const str = value.split(' ');
            const year = str[5];
            const month = str[1];
            const date = str[2];
            return date + ' ' + month + ' ' + year;
        }
        return '';
    }

    confirm(part: Participant) {
        this.meetingService.confirmParticipation(this.participant.id).subscribe( res => {
            this.messService.add({severity: 'success', summary: 'Success Message', detail: 'Meeting confirmed'});
            this.delay(600).then(any => {
                window.location.reload();
            });
        });
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

    parseTime2(value: any): string {
        if ((typeof value === 'string')) {
            let str = value.split('T');
            str = str[1].split(':');
            let hour = str[0];
            let min = str[1];
            return hour + ':' + min;
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
                private pollService: PollService,
                private fnsCheckService: FnsCheckService,
                private cardService: CardService
            ) {
        super(messageService, router, chatService, authService, route);
        const users: UserData[] = [];
        //for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }

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
                        this.me = this.participant.meetingParticipant;
                        this.meetingService.setParticipant(participant);

                        this.meetingService.getMeeting(this.participant.participantOfMeeting.id).subscribe((meeting: any) => {
                            if (meeting) {
                                console.log(meeting);
                                this.meeting = meeting;
                                this.meetingService.setMeeting(meeting);
                                if (this.meeting.meetingLocation) {
                                    this.markerTitle = this.meeting.meetingLocation.placeName;
                                    this.overlays.push(new google.maps.Marker({
                                        position:
                                            {lat: Number(this.meeting.meetingLocation.lat), lng: Number(this.meeting.meetingLocation.lng)},
                                        title: this.meeting.meetingLocation.placeName
                                    }));
                                }
                                this.meetingService.setMeeting(meeting);
                                this.overlaysPoll = [];
                                this.overlaysPollPopUp = [];
                                if (this.meeting.pollForPlaceOpen === 1) {
                                    this.pollService.getPlacePoll(this.meeting.id).subscribe(poll => {
                                        if (poll) {
                                            this.placePoll = poll;
                                            // this.placePoll = this.placePoll.sort((a, b): number => {
                                            //     if (a.id > b.id) {
                                            //         return 1;
                                            //     }
                                            //     if (a.id < b.id) {
                                            //         return -1;
                                            //     }
                                            //     return 0;
                                            // });
                                            this.placePoll.forEach(item => {
                                                this.overlaysPollPopUp.push(new google.maps.Marker({
                                                    position:
                                                        {lat: Number(item.oneLocation.lat), lng: Number(item.oneLocation.lng)},
                                                    title: item.oneLocation.placeName
                                                }));
                                                this.overlaysPoll.push(new google.maps.Marker({
                                                    position:
                                                        {lat: Number(item.oneLocation.lat), lng: Number(item.oneLocation.lng)},
                                                    title: item.oneLocation.placeName
                                                }));
                                            });
                                        }
                                    });
                                }

                                if (this.meeting.pollForDateOpen === 1) {
                                    this.pollService.getDatePoll(this.meeting.id).subscribe(poll => {
                                        if (poll) {
                                            this.datePoll = poll;
                                            // this.datePoll = this.datePoll.sort((a, b): number => {
                                            //     if (a.id > b.id) {
                                            //         return 1;
                                            //     }
                                            //     if (a.id < b.id) {
                                            //         return -1;
                                            //     }
                                            //     return 0;
                                            // });
                                        }
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
                                    this.meetingService.getFriends().subscribe(fr => {
                                        this.users = fr;
                                        this.participants.forEach(part => {
                                            if (this.users) {
                                                this.users = this.users.filter(item => item.id !== part.meetingParticipant.id);
                                            }
                                        });
                                    });
                                    if (this.participants) {
                                        this.participants = this.participants.filter(item => item.meetingParticipant.id !== this.me.id);
                                    }
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
            { field: 'itemTitle', header: 'Item' },
            { field: 'price', header: 'Price' },
            { field: 'itemAmount', header: 'Amount' },
            { field: 'itemCurrentAmount', header: 'Left' },
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

    markAsPayed() {
        this.cardService.setBillCard(this.fixedCardId, this.meeting.id).subscribe( val => {
            this.bill.billOwner = this.participant.meetingParticipant;
            this.showAddCard = false;
            let cars = [...this.billItems];
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
                    this.cardService.setBillCard(this.fixedCardId, this.meeting.id);
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
            this.card.owner = this.participant.meetingParticipant;
            this.cardService.save(this.card).subscribe(result => {
                //this.card = null;
                this.cards.push(result);
                this.showNewCard = false;
                this.messService.add({severity: 'success', summary: 'Success Message', detail:'Card added'});
            }, error => console.error(error));
        }
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
                if (this.bill.billOwner === null) {
                    this.showAddCard = true;
                    this.cardService.getAll(this.participant.meetingParticipant.id).subscribe(data => {
                        if (data) {
                            this.cards = data;
                        } else {
                            this.cards = [];
                        }
                    });
                } else {
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
                            this.cardService.setBillCard(this.fixedCardId, this.meeting.id);
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
                }
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

    setCard(card: any) {
        this.fixedCardId = card.id;
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

    addPlaceOnMap() {
        this.dialogVisible = false;
        let place = {} as Place;
        place.lat = this.selectedPosition.lat();
        place.lng = this.selectedPosition.lng();
        place.placeName = this.markerTitle2;
        this.overlaysPollPopUp.push(new google.maps.Marker({position:{lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng()}, title: this.markerTitle2, draggable: false}));
        this.overlaysPoll.push(new google.maps.Marker({position:{lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng()}, title: this.markerTitle2, draggable: true}));
        this.pollService.addPlaceInPoll(place, this.participant.id).subscribe(res => {
            this.pollService.getPlacePoll(this.meeting.id).subscribe(places => {
                if (places) {
                    this.placePoll = places;
                    // this.placePoll = this.placePoll.sort((a, b): number => {
                    //     if (a.id > b.id) {
                    //         return 1;
                    //     }
                    //     if (a.id < b.id) {
                    //         return -1;
                    //     }
                    //     return 0;
                    // });
                    this.markerTitle2 = null;
                }
            });
        });
        //this.markerTitle = '';
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

    openVoteForPlace() {
        this.pollService.openPlacePoll(this.meeting.id).subscribe(res => {
            this.meeting = res;
            this.pollService.getPlacePoll(this.meeting.id).subscribe(places => {
                if (places) {
                    this.placePoll = places;
                }
            });
        });
    }

    voteForPlace(meetingLocationId: number) {
        this.pollService.voteForPlace(meetingLocationId).subscribe(res => {
            this.pollService.getPlacePoll(this.meeting.id).subscribe(places => {
                if (places) {
                    this.placePoll = places;
                    // this.placePoll = this.placePoll.sort((a, b): number => {
                    //     if (a.id > b.id) {
                    //         return 1;
                    //     }
                    //     if (a.id < b.id) {
                    //         return -1;
                    //     }
                    //     return 0;
                    // });
                    this.placePoll.forEach(item => {
                        this.overlaysPoll.push(item.oneLocation);

                    });
                    this.messService.add({severity: 'success', summary: 'Success Message', detail: 'your vote\'s been counted'});
                }
            });
        });
    }

    addPlace() {
        this.showMap = true;
    }

    voted(place: Meetinglocation): boolean {
        let checkOut = false;
        place.voicesForLocation.forEach(voice => {
            if (voice.id === this.me.id) {checkOut = true; }
        });
        return checkOut;
    }

    votedDate(date: DatePoll) {
        let checkOut = false;
        date.voicesForDate.forEach(voice => {
            if (voice.id === this.me.id) {checkOut = true; }
        });
        return checkOut;
    }


    fix(user: User) {
        this.fixedUserId = user.id;
        this.fixedUser = user;
    }

    add() {
        let participant = {} as Participant;
        participant.statusOfConfirmation = 'not confirmed';
        participant.meetingParticipant = this.fixedUser;
        this.users = this.users.filter(item => item.id !== this.fixedUser.id);
        this.meetingService.addParticipant(participant, this.meeting.id).subscribe(res => {
            participant = res;
            this.participants.push(participant);
        });
    }

    decline(part: Participant) {
        this.meetingService.declineParticipation(part.id).subscribe( res => {
            this.delay(600).then(any => {
                window.location.reload();
            });
        });
    }

    addDate() {
        this.pollService.addDateInPoll(this.dateForVote, this.participant.id).subscribe(res => {
            this.pollService.getDatePoll(this.meeting.id).subscribe(places => {
                if (places) {
                    this.datePoll = places;
                    // this.datePoll = this.datePoll.sort((a, b): number => {
                    //     if (a.id > b.id) {
                    //         return 1;
                    //     }
                    //     if (a.id < b.id) {
                    //         return -1;
                    //     }
                    //     return 0;
                    // });
                    this.messService.add({severity: 'success', summary: 'Success Message', detail: 'new date added'});
                }
            });
            this.dateForVote = null;
        });
    }

    voteForDate(dateId: number) {
        this.pollService.voteForDate(dateId).subscribe(res => {
            this.pollService.getDatePoll(this.meeting.id).subscribe(dates => {
                if (dates) {
                    this.datePoll = dates;
                    // this.datePoll = this.datePoll.sort((a, b): number => {
                    //     if (a.id > b.id) {
                    //         return 1;
                    //     }
                    //     if (a.id < b.id) {
                    //         return -1;
                    //     }
                    //     return 0;
                    // });
                    this.messService.add({severity: 'success', summary: 'Success Message', detail: 'your vote\'s been counted'});
                }
            });
        });
    }


    // FNS
    showFnsDialog() {
        this.car = {} as Item;
        this.newCar = true;
        this.fnsCheckInfo = {} as FnsCheckInfo;
        this.displayFnsDialog = true;
    }

    hideFnsDialog() {
        this.displayFnsDialog = false;
    }

    markAsPayedForFNS() {
        this.cardService.setBillCard(this.fixedCardId, this.meeting.id).subscribe(val => {
            this.bill.billOwner = this.participant.meetingParticipant;
            this.showAddCardForFNS = false;
            this.fnsCheckService.getCheckDetails(this.fnsCheckInfo).subscribe(
                data => {
                    const fnsReceipt: FnsReceipt = data;
                    fnsReceipt.items.forEach(item => {
                        this.newCar = true;
                        this.car = {} as Item;
                        this.car.itemTitle = item.name;
                        this.car.itemAmount = item.quantity || 1;
                        this.car.price = item.price / 100;
                        this.save();
                    });
                    this.messService.add({severity:'info', summary:'Info', detail: 'Check details received.'});
                    this.hideFnsDialog();
                },
                error => {
                    this.messService.add({severity:'error', summary:'Error', detail: 'Unable to get check details; please make sure the codes you provided are correct.'});
                });
        });
    }

    getFnsCheck() {
        if (this.bill.billOwner === null) {
            this.showAddCardForFNS = true;
        }

    }
}
