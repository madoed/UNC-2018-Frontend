import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { environment } from '@env';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    public CARD_API = 'http://127.0.0.1:8000';

    constructor(
      private apiService: ApiService
    ) {}

    getAll(id: Number): Observable<any> {
        return this.apiService.get(this.CARD_API + '/card-list/' + id);
    }

    get(cardId: Number): Observable<any> {
        return this.apiService.get(this.CARD_API + '/card/' + cardId);
    }

    save(card: any): Observable<any> {
        let result: Observable<Object>;
        if (card['href']) {
            result = this.apiService.put(card.href, card);
        } else {
            result = this.apiService.post(this.CARD_API, card);
        }
        return result;
    }

    remove(href: string) {
        return this.apiService.delete(href);
    }
}
