import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem, MessageService as mes} from 'primeng/api';
import {AuthService, Meeting, MeetingService, Participant, User, Place, CardService, StorageService, MessageService} from '@app/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { environment } from '@env';

import {Card} from '@app/core/models/card.model';


declare var google: any;

@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrls: ['./meeting-create.component.css'],
  providers: [mes],
  //encapsulation: ViewEncapsulation.None
})
export class MeetingCreateComponent implements OnInit {

    currentAvatarUrl: any;

    card = {} as Card;
    cards: Array<Card> = null;
    showAddCard: boolean = false;
    CVV: number;
    lastFourNumbers: number;
  fixedCardId: number = null;
  users: Array<any>;
  fixedUserId;
  fixedUser: User;
  participants: Participant[];
  empty = true;

  displayDialogBack: boolean;
  openMap: boolean;
  items: MenuItem[];
  activeIndex: number = 0;
  meeting = {} as Meeting;
  private date: Date;
  private minDate: Date;

    options: any;

    overlays: any[];

    dialogVisible: boolean;

    markerTitle: string;

    selectedPosition: any;

    infoWindow: any;

    avatar: any;


    constructor(private messService: mes,
                private meetingService: MeetingService,
                public route: ActivatedRoute,
                private authService: AuthService,
                public router: Router,
                private cardService: CardService,
                private messageService: MessageService,
                private storageService: StorageService
                ) {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        this.minDate = new Date();
        this.minDate.setMonth(month);
        this.minDate.setFullYear(year);
        this.fixedUserId  = this.authService.user.id;
        this.meetingService.getFriends().subscribe(data => {
            this.users = data;
            console.log(data);
        });
        this.currentAvatarUrl = environment.defaultMeeting;
    }

  ngOnInit() {
      this.meeting.boss = this.authService.user;
      this.meeting.status = 'new';
      this.meeting.pollForPlaceOpen = 0;
      this.meeting.pollForDateOpen = 0;

      this.showAddCard = false;
      this.participants = [];

      this.options = {
          center: {lat: 51.6754966, lng: 39.2088823},
          zoom: 12
      };

      this.infoWindow = new google.maps.InfoWindow();
      if (!this.overlays || !this.overlays.length) {
          this.overlays = [];
      }

      this.displayDialogBack = false;
      this.openMap = false;

      this.items = [{
          label: 'Start',
          command: (event: any) => {
              this.activeIndex = 0;
              this.messService.add({severity:'info', summary:'First Step', detail: event.item.label});
          }
      },
          {
              label: 'Date and Place',
              command: (event: any) => {
                  this.activeIndex = 1;
                  this.messService.add({severity:'info', summary:'Seat Selection', detail: event.item.label});
              }
          },
          {
              label: 'Participants',
              command: (event: any) => {
                  this.activeIndex = 2;
                  this.messService.add({severity:'info', summary:'Pay with CC', detail: event.item.label});
              }
          },
          {
              label: 'Finish',
              command: (event: any) => {
                  this.activeIndex = 3;
                  this.messService.add({severity:'info', summary:'Last Step', detail: event.item.label});
              }
          }
      ];

      this.cardService.getAll(this.authService.user.id).subscribe(data => {
          if (data) {
              this.cards = data;
          } else {
              this.cards = [];
          }
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

    removeCard(href) {
        this.cardService.remove(href).subscribe(result => {
        }, error => console.error(error));
    }

    setCard(card: any) {
        this.fixedCardId = card.id;
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

  backToList() {
    this.displayDialogBack = true;
  }

    fix(user: User) {
        this.fixedUserId = user.id;
        this.fixedUser = user;
    }

    add() {
        let participant = {} as Participant;
        participant.statusOfConfirmation = 'not confirmed';
        participant.meetingParticipant = this.fixedUser;
        this.participants.push(participant);
        this.users = this.users.filter(item => item.id !== this.fixedUser.id);
        console.log(this.users);
        this.empty = false;
    }

    parse(value: any): String | '' {
        if ((typeof value === 'string')) {
            const str = value.split(' ');
            const year = str[3];
            const month = str[1];
            const date = str[2];
            return date + ' ' + month + ' ' + year;
        }
        return '';
    }

    createMeeting() {
        if (this.avatar) {
            const filename = this.meeting.meetingName + '-' + this.avatar.name;
            this.storageService.upload(this.avatar, filename).subscribe(
                data => {
                    this.meeting.avatarUrl = data.fileDownloadUri;
                    this.internalCreate();
                },
                error => {
                    this.messService.add({severity:'error', summary:'Error', detail:'Unable to upload image.'});
                });
        } else {
            this.internalCreate();
        }
    }

    private internalCreate() {
        if (this.selectedPosition) {
            let place = {} as Place;
            place.lat = this.selectedPosition.lat();
            place.lng = this.selectedPosition.lng();
            place.placeName = this.markerTitle;
            this.meeting.meetingLocation = place;
        }
        let participant = {} as Participant;
        participant.statusOfConfirmation = 'confirmed';
        participant.meetingParticipant = this.authService.user;
        this.participants.push(participant);
        this.meetingService.createMeeting(this.meeting).subscribe(data => {
            this.meeting = data;
            //this.cardService.setBillCard(this.fixedCardId, this.meeting.id);
            this.meetingService.addParticipants(this.participants, this.meeting.id).subscribe( res => {
                this.router.navigate(['/meeting-list']);
                    this.messService.add({severity: 'success', summary: 'Success Message', detail:'Meeting Created'});

                },
                (err: HttpErrorResponse) => {
                this.messService.add({severity: 'error', summary: 'Error Message', detail: 'oops something happened'});
            });
            },
            (err: HttpErrorResponse) => {
                this.messService.add({severity: 'error', summary: 'Error Message', detail: 'oops something happened'});
            });
    }

    // Meeting avatar selection
    clearAvatar() {
        this.currentAvatarUrl = environment.defaultMeeting;
    }
  
    onSelectFile(files) {
        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.messService.add({severity:'error', summary:'Error', detail: 'Please select an image file'});
            return;
        }

        this.avatar = files[0];
        var reader = new FileReader();
        reader.readAsDataURL(this.avatar);
        reader.onload = (_event) => {
            this.currentAvatarUrl = reader.result;
        }
    }
}
