import { Injectable } from '@angular/core';
import {Place} from '../models';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Meetinglocation} from '@app/core/models/meetinglocation';
import {CustomPollOption} from '@app/core/models/custompolloption.model';
import {CustomPoll} from '@app/core/models/custompoll.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  public MEETING_API = 'http://127.0.0.1:8000';

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private http: HttpClient) { }

    getPlacePoll(meetingId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-place-poll/' + meetingId);
    }

    openPlacePoll(meetingId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-place-poll-open/' + meetingId);
    }

    closePlacePoll(meetingId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-place-poll-close/' + meetingId);
    }

    addPlaceInPoll(location: Place, participantId: number): Observable<any> {
        return this.http.post(this.MEETING_API + '/meeting-place-poll-add/' + participantId, location);
    }

    voteForPlace (meetingLocationId: number): Observable<any> {
        return this.http.post(this.MEETING_API + '/meeting-place-poll-vote/' + this.authService.user.id, meetingLocationId);
    }

    getDatePoll(meetingId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-date-poll/' + meetingId);
    }

    openDatePoll(meetingId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-date-poll-open/' + meetingId);
    }

    closeDatePoll(meetingId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-date-poll-close/' + meetingId);
    }

    addDateInPoll(date: Date, participantId: number): Observable<any> {
        return this.http.post(this.MEETING_API + '/meeting-date-poll-add/' + participantId, date);
    }

    voteForDate (dateId: number): Observable<any> {
        return this.http.post(this.MEETING_API + '/meeting-date-poll-vote/' + this.authService.user.id, dateId);
    }

    getCustomPolls (meetingId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-custom-polls/' + meetingId);
    }

    openCustomPoll (pollId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-custom-poll-open/' + pollId);
    }

    closeCustomPoll (pollId: number): Observable<any> {
        return this.http.get(this.MEETING_API + '/meeting-custom-poll-close/' + pollId);
    }

    voteForOption (customPollOptionId: number, userId): Observable<any> {
        return this.http.post(this.MEETING_API + '/meeting-custom-poll-vote/' + userId, customPollOptionId);
    }

    addOptionInPoll(pollId: number, customPollOption: CustomPollOption, participantId: number): Observable<any> {
        return this.http.post(this.MEETING_API + '/meeting-poll-add-option/' + participantId +
            '/' + pollId, customPollOption);
    }

    createPoll(customPoll: CustomPoll): Observable<any> {
        return this.http.post(this.MEETING_API + '/meeting-poll-create', customPoll);

    }
}
