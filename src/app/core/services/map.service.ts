import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class MapService {
    public CARD_API = 'http://127.0.0.1:8000'  + '/map';

    constructor(
      private apiService: ApiService
    ) {}

    getAll(): Observable<any> {
        return this.apiService.get(this.CARD_API);
    }

    save(place: any): Observable<any> {
        return this.apiService.post(this.CARD_API, place);
    }

}
