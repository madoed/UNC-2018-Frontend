import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { environment } from '@env';

@Injectable()
export class CardService {
    public CARD_API = environment.api_url + '/card';

    constructor(
      private apiService: ApiService
    ) {}

    getAll(): Observable<any> {
        return this.apiService.get(this.CARD_API);
    }

    get(id: string): Observable<any> {
        return this.apiService.get(this.CARD_API + '/' + id);
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
