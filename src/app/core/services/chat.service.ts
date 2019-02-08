import { Injectable } from '@angular/core';
import {environment} from '@env';
import {ApiService, AuthService} from '@app/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    public CHAT_API = 'http://127.0.0.1:8000' + '/chat';

    constructor(
        private apiService: ApiService, private authService: AuthService
    ) {}

    getAll(): Observable<any> {
        return this.apiService.get(this.CHAT_API + '/1');
        //return this.apiService.get(this.CARD_API +'/' this.authService.getCurrentUser());
    }

}
