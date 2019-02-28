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

  panelOpenState = false;
  meetings: Array<Participant>;
  meeting: Meeting;

  constructor(private meetingService: MeetingService,
              private authService: AuthService,
              private router: Router,
              private chatService: ChatService) { }

  ngOnInit() {
    this.meetingService.getAll().subscribe(data => {
      this.meetings = data;
      console.log(data);
    });
  }

  openMeeting(meeting: Meeting) {
    //-1 is  this.authService.getCurrentUser().id
    console.log(meeting);
    this.meetingService.getMeeting(meeting.id).subscribe((meet: Meeting) => {
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
