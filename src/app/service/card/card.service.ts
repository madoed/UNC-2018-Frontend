import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class CardService {
    public API = '//127.0.0.1:8000';
    public CARD_API = this.API + '/card';

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<any> {
        return this.http.get(this.API + '/card');
    }

    get(id: string): Observable<any> {
        return this.http.get(this.CARD_API + '/' + id);
    }

    save(card: any): Observable<any> {
        let result: Observable<Object>;
        if (card['href']) {
            result = this.http.put(card.href, card);
        } else {
            result = this.http.post(this.CARD_API, card);
        }
        return result;
    }

    remove(href: string) {
        return this.http.delete(href);
    }
}
