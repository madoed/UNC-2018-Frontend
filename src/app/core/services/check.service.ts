import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService, AuthService, Participant} from '@app/core';
import {HttpClient} from '@angular/common/http';
import {Check} from '@app/core/models/check.model';

@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private http: HttpClient) { }

    getAll(status: string): Observable<Check[]> {
        // return this.apiService.get(this.MEETING_API + '/1');
        return this.apiService.get('http://127.0.0.1:8000' + '/check-list/'
            + this.authService.user.id + '/' + status);
    }

    getOwedChecks(status: string): Observable<Check[]> {
        // return this.apiService.get(this.MEETING_API + '/1');
        return this.apiService.get('http://127.0.0.1:8000' + '/check-owed-list/'
            + this.authService.user.id + '/' + status);
    }
}
