import { Component, OnInit } from '@angular/core';
import {Chat} from '@app/core/models/chat.model';
import {ChatService} from '@app/core/services/chat.service';
import {AuthService} from '@app/core';
import {Meeting} from '@app/core/models/meeting.model';
import {MeetingService} from '@app/core/services/meeting.service';
import {Router} from '@angular/router';
import {Participant} from '@app/core/models/participant.model';
import {MatTabChangeEvent} from '@angular/material';
import {MessageService as mes} from 'primeng/api';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css'],
  providers: [mes]
})
export class MeetingListComponent implements OnInit {

  private date = new Date();
  panelOpenState = false;
  meetings: Participant[] = [];
  meeting: Meeting;
  meetingsNew: Participant[] = [];
  meetingsPast: Participant[] = [];

  constructor(private meetingService: MeetingService,
              private authService: AuthService,
              private router: Router,
              private messService: mes) { }

  ngOnInit() {
    this.meetingService.getAll(0).subscribe(data => {
      this.meetings = data;
    });
  }

    loadMeetings(tab: MatTabChangeEvent) {
        if (tab.index === 1 && !this.meetingsPast.length) {
            this.meetingService.getAll(1).subscribe( data => {
                if (data !== null) {
                    this.meetingsPast = data;
                    console.log(data);
                }
            });
        }
        if (tab.index === 2 && !this.meetingsNew.length) {
            this.meetingService.getAll(2).subscribe( data => {
                if (data !== null) {
                    this.meetingsNew = data;
                }
            });
        }
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

  openMeeting(meeting: Participant) {
    console.log(meeting);
    this.meetingService.getMeeting(meeting.participantOfMeeting.id).subscribe((meet: Meeting) => {
      if (meet) {
        this.meeting = meet;
        this.meetingService.setMeeting(this.meeting);
        if (this.meeting.boss.id === this.authService.user.id) {
          this.router.navigate(['/meeting-list/meeting-main', meeting.id]);
        }
      } else {
        console.log(`another boss`);
      }
    });
  }

  async delay(ms: number) {
      await new Promise(resolve => setTimeout(() => resolve(), ms))
          .then();
  }

  confirm(part: Participant) {
      this.meetingService.confirmParticipation(part.id).subscribe( res => {
          this.messService.add({severity: 'success', summary: 'Success Message', detail: 'Meeting confirmed'});
          this.delay(600).then(any => {
              window.location.reload();
          });
          });
  }

}
