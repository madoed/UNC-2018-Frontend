import { Injectable } from '@angular/core';
import {environment} from '@env';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {User} from '../models/user.model';
import {Observable} from 'rxjs';
import {Chat} from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    public CHAT_API = environment.api_url + '/chats';
    // private channel_name: string;
    // private channel_id: number;
    public channel: Chat;
    private userId: number;

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {}

    async init() {
        const user = await this.authService.userPromise;
        this.userId = user.id;
    }

    getOld(): Observable<Chat[]> {
        // return this.apiService.get(this.CHAT_API + '/1');
        return this.apiService.get('http://127.0.0.1:8000/chats-old/' + this.userId);
    }

    getNew(): Observable<Chat[]> {
        // return this.apiService.get(this.CHAT_API + '/1');
        return this.apiService.get('http://127.0.0.1:8000/chats-new/' + this.userId);
    }

    setChannel(channel: Chat) {
        this.channel = channel;
        console.log(this.channel);
        // this.channel_id = id;
        // this.channel_name = name;
    }

    getFriends(): Observable<User[]> {
        // return this.apiService.get(this.CHAT_API + '/1');
        return this.apiService.get('http://127.0.0.1:8000/friends/' + this.userId);
    }

    createChat(card: any): Observable<any> {
        return this.apiService.post('http://127.0.0.1:8000/chat', card);
    }

    getDialogue (user1: number, user2: number): Observable<any> {
        return this.apiService.get('http://127.0.0.1:8000/dialogue/' + user1 + '/' + user2);
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

    getMeetingChatId (partId: number): Observable<number> {
        return this.apiService.get('http://127.0.0.1:8000/meeting-chat-id/' + partId);
    }

}
