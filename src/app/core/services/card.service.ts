import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { environment } from '@env';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    public CARD_API = 'http://127.0.0.1:8000';

    constructor(
      private apiService: ApiService,
      private http: HttpClient
    ) {}

    getAll(id: Number): Observable<any> {
        return this.apiService.get(this.CARD_API + '/card-list/' + id);
    }

    get(cardId: Number): Observable<any> {
        return this.apiService.get(this.CARD_API + '/card/' + cardId);
    }

    save(card: any): Observable<any> {
        return this.apiService.post(this.CARD_API + '/card', card);
    }

    remove(href: string) {
        return this.apiService.delete(href);
    }

    setBillCard (cardId: number, meetingId: number): Observable<any>  {
        console.log('ggg');
        return this.http.post(this.CARD_API + '/bill-card/' + cardId,  meetingId);
    }
}
