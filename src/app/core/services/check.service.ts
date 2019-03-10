import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService, AuthService, Participant} from '@app/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

    confirmParticipation(checkId: number): Observable<any>  {
        return this.apiService.post('http://127.0.0.1:8000' + '/payment-confirm', checkId);
    }

    parseCheck(fiscalNumber: string, fiscalDocument: string, fiscalSign: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': 'Basic Kzc5MDgxMzgzNzA0Ojc5OTE0OQ==',
                'device-id': '',
                'device-os': ''
            })
        };
      return this.http.get('https://proverkacheka.nalog.ru:9999/v1/mobile/users/login', httpOptions );
      // return this.http.get('https://proverkacheka.nalog.ru:9999/v1/inns/*/kkts/' +
      //     '*/fss/{' + fiscalNumber + '}/tickets/{' + fiscalDocument + '}?fiscalSign={' +
      //     fiscalSign + '}&sendToEmail=no');
    }
}
