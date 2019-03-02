import { Injectable } from '@angular/core';
import {environment} from '@env';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {User} from '../models/user.model';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Chat} from '../models/chat.model';
import {Message} from '../models/message.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    public CHAT_API = environment.api_url + '/chats';
    // private channel_name: string;
    // private channel_id: number;
    private channel: Chat;

    constructor(
        private apiService: ApiService,
        private authService: AuthService 
    ) {}

    getAll(): Observable<Chat[]> {
        // return this.apiService.get(this.CHAT_API + '/1');
        return this.apiService.get(this.CHAT_API + '/' + this.authService.user.id);
    }

    setChannel(channel: Chat) {
        this.channel = channel;
        console.log(this.channel);
        // this.channel_id = id;
        // this.channel_name = name;
    }

    getFriends(): Observable<User[]> {
        // return this.apiService.get(this.CHAT_API + '/1');
        return this.apiService.get('http://127.0.0.1:8000/friends/' + this.authService.user.id);
    }

    createChat(card: any): Observable<any> {
        return this.apiService.post('http://127.0.0.1:8000/chat', card);
    }

    /*getChannelId(): number {
        return this.channel_id;
    }

    getChannelName(): string {
        return this.channel_name;
    }
*/
    getChannel(chat: Number): Observable<any> {
    console.log(chat);
    return this.apiService.get('http://127.0.0.1:8000/chat/' + chat);
  }

}
