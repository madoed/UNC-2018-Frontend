import { Injectable } from '@angular/core';
import {environment} from '@env';
import {ApiService, AuthService, User} from '@app/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Chat} from '@app/core/models/chat.model';
import {Message} from '@app/core/models/message.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    public CHAT_API = 'http://127.0.0.1:8000' + '/chats';
    // private channel_name: string;
    // private channel_id: number;
    private channel: Chat;

    constructor(
        private apiService: ApiService, private authService: AuthService ) {}

    getAll(): Observable<Chat[]> {
        // return this.apiService.get(this.CHAT_API + '/1');
        return this.apiService.get(this.CHAT_API + '/' + this.authService.getCurrentUser().id);
    }

    setChannel(channel: Chat) {
        this.channel = channel;
        console.log(this.channel);
        // this.channel_id = id;
        // this.channel_name = name;
    }

    getFriends(): Observable<User[]> {
        // return this.apiService.get(this.CHAT_API + '/1');
        return this.apiService.get('http://127.0.0.1:8000/friends/' + this.authService.getCurrentUser().id);
    }

    createChat(card: any) {
        this.apiService.post('http://127.0.0.1:8000/chat', card) .subscribe(
            result => console.log("5. createService: " + result));
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
