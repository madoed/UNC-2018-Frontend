import { Component, OnInit } from '@angular/core';
import {Chat} from '@app/core/models/chat.model';
import {ChatService} from '@app/core/services/chat.service';
import {AuthService} from '@app/core';
import {Meeting} from '@app/core/models/meeting.model';
import {MeetingService} from '@app/core/services/meeting.service';
import {Router} from '@angular/router';
import {Participant} from '@app/core/models/participant.model';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
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
              private chatService: ChatService) { }

  ngOnInit() {
    this.meetingService.getAll().subscribe(data => {
      console.log(data);
      data.forEach(item => {
          if (item.participantOfMeeting.status === 'new') {
              this.meetingsNew.push(item);
          } else if (item.participantOfMeeting.status === 'past') {
              this.meetingsPast.push(item);
          } else {
              this.meetings.push(item);
          }
      });
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

  openMeeting(meeting: Participant) {
    //-1 is  this.authService.getCurrentUser().id
    console.log(meeting);
    this.meetingService.getMeeting(meeting.participantOfMeeting.id).subscribe((meet: Meeting) => {
      if (meet) {
        this.meeting = meet;
        this.meetingService.setMeeting(this.meeting);
        if (this.meeting.boss.id === -1) {
          this.router.navigate(['/meeting-list/meeting-main', meeting.id]);
        }
      } else {
        console.log(`another boss`);
      }
    });
  }

}
