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
import {HttpClient} from '@angular/common/http';
import {Bill} from '@app/core/models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  public MEETING_API = 'http://127.0.0.1:8000';
  // private channel_name: string;
  // private channel_id: number;
  private meeting: Meeting;
  private participant: Participant;

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private http: HttpClient) { }

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
        //return this.apiService.get('http://127.0.0.1:8000/bill-items/-9');
        return this.apiService.get('http://127.0.0.1:8000/bill-items/' + this.meeting.id);
    }

    getParticipantItems(): Observable<ItemAmount[]> {
    console.log(this.participant.id);
        return this.apiService.get('http://127.0.0.1:8000/participant-items/' + this.participant.id);
        //return this.apiService.get('http://127.0.0.1:8000/bill-items/' + this.meeting.id);
    }

    updateItem(item: Item): Observable<any> {
        //return this.http.put('http://127.0.0.1:8000/item-update/-9', item);
        return this.apiService.put('http://127.0.0.1:8000/item-update/' + this.meeting.id, item);
    }



    addItem(item: Item): Observable<any> {
        //return this.http.post('http://127.0.0.1:8000/item-add/-9', item);
        return this.apiService.post('http://127.0.0.1:8000/item-add/' + this.meeting.id, item);
    }

    deleteItem(item: number): Observable<any>  {
        return this.http.delete('http://127.0.0.1:8000/item-delete/' +  item);
    }

    setDescription (descriprion: string, id: number) {
    this.apiService.post('http://127.0.0.1:8000/meeting-description/' + id, descriprion) .subscribe(
        result => console.log(result));
  }

    checkUpdate (items: Array<Item>, participantId: number): Observable<any> {
        return this.http.post('http://127.0.0.1:8000/check-items-update/' +  participantId, items);
    }

    deleteItemFromCheck(item: number, participantId: number): Observable<any>  {
        return this.http.delete('http://127.0.0.1:8000/check-delete-item/' +  participantId + '/' + item);
    }

    getBill (meetingId: number): Observable<any> {
    return this.apiService.get('http://127.0.0.1:8000/bill/' + meetingId);
    //return this.apiService.get('http://127.0.0.1:8000/bill-items/' + this.meeting.id);
    }

    getFriends(): Observable<User[]> {
        // return this.apiService.get(this.CHAT_API + '/1');
        return this.apiService.get('http://127.0.0.1:8000/friends/' + this.authService.user.id);
    }
}
