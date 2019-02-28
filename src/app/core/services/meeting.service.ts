import { Injectable, OnInit } from '@angular/core';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {User} from '../models/user.model';
import {Meeting} from '../models/meeting.model';
import {Observable} from 'rxjs';
import {Participant} from '../models/participant.model';
import {Chat} from '../models/chat.model';

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
    return this.apiService.get(this.MEETING_API + '/meeting-list/' + this.authService.user.id);
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
