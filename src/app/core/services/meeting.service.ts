import { Injectable } from '@angular/core';
import {ApiService, AuthService, User} from '@app/core';
import {Meeting} from '@app/core/models/meeting.model';
import {Observable} from 'rxjs';
import {Participant} from '@app/core/models/participant.model';
import {Chat} from '@app/core/models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  public MEETING_API = 'http://127.0.0.1:8000';
  // private channel_name: string;
  // private channel_id: number;
  private meeting: Meeting;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  getAll(): Observable<Participant[]> {
    // return this.apiService.get(this.MEETING_API + '/1');
    return this.apiService.get(this.MEETING_API + '/meeting-list/' + this.authService.getCurrentUser().id);
  }

  setMeeting(meeting: Meeting) {
    this.meeting = meeting;
  }


  getMeeting(meeting: Number): Observable<any> {
    console.log(meeting);
    return this.apiService.get(this.MEETING_API + '/meeting/' + meeting);
  }

  getCurrentMeeting(): Meeting {
    return this.meeting;
  }

  setDate(date: Date, id: number){
    this.apiService.post('http://127.0.0.1:8000/meeting-date/' + id, date) .subscribe(
        result => console.log("5. createService: " + result));
  }

  getParticipants(): Observable<Participant[]> {
    // return this.apiService.get(this.CHAT_API + '/1');
    return this.apiService.get('http://127.0.0.1:8000/participants/' + this.meeting.id);
  }
}
