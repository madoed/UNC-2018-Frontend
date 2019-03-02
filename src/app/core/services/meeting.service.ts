import { Injectable, OnInit } from '@angular/core';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {User} from '../models/user.model';
import {Meeting} from '../models/meeting.model';
import {Observable} from 'rxjs';
import {Participant} from '../models/participant.model';
import {Chat} from '../models/chat.model';
import {Item} from '@app/core/models/item.model';
import {ItemAmount} from '@app/core/models/itemamount.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  public MEETING_API = 'http://127.0.0.1:8000';
  // private channel_name: string;
  // private channel_id: number;
  private meeting: Meeting;
  private participant: Participant;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  getAll(): Observable<Participant[]> {
    // return this.apiService.get(this.MEETING_API + '/1');
    return this.apiService.get(this.MEETING_API + '/meeting-list/' + this.authService.user.id);
  }

  setMeeting(meeting: Meeting) {
    this.meeting = meeting;
  }

  setParticipant(participant: Participant) {
    this.participant = participant;
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

    getByParticipant(id: Number): Observable<any> {
        return this.apiService.get('http://127.0.0.1:8000/participant/' + id);
    }

    getAllItems(): Observable<Item[]> {
        return this.apiService.get('http://127.0.0.1:8000/bill-items/-9');
        //return this.apiService.get('http://127.0.0.1:8000/bill-items/' + this.meeting.id);
    }

    getParticipantItems(): Observable<ItemAmount[]> {
    console.log(this.participant.id);
        return this.apiService.get('http://127.0.0.1:8000/participant-items/' + this.participant.id);
        //return this.apiService.get('http://127.0.0.1:8000/bill-items/' + this.meeting.id);
    }
}
