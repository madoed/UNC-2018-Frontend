import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
    public API = '//127.0.0.1:8000';
    public CARD_API = this.API + '/map';

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<any> {
        return this.http.get(this.API + '/map');
    }

    save(place: any): Observable<any> {
        let result: Observable<Object>;
        result = this.http.post(this.CARD_API, place);
        return result;
    }

}
