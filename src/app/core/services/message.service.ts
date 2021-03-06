import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiService} from './api.service';
import {Message} from '../models/message.model';
import {Chat} from '../models/chat.model';
import {AuthService} from '@app/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private messages: Array<Message> = [];
    private msgs = new Subject<Array<Message>>();

    constructor(private apiService: ApiService,
                private http: HttpClient) {}

    push(message: Message) {
        this.messages.push(message);
        this.msgs.next(this.messages);
    }

//    pushMessages(messages: Array<any>) {
//        this.messages.push(message);
//        this.msgs.next(this.messages);
//    }

    // filterMessages(channel: Chat): Array<Message> {
    //     return this.messages.filter(message => channel === message.from_chat)
    //         .sort((m1, m2) => {
    //             if (m1.timestamp > m2.timestamp) {
    //                 return 1;
    //             }
    //
    //             return -1;
    //         });
    // }
/*
    sendReadReceipt(channelId: string, username: string) {
        this.apiService.post('http://127.0.0.1:8000' + '/messages/', {
            channel: channelId,
            username: username
        });
    }*/

    getOldMessages(id: number, iduser: number): Observable<Message[]> {
        return this.apiService.get('http://127.0.0.1:8000' + '/messages-old/' + id + '/' + iduser);
    }

    getNewMessages(id: number, iduser: number): Observable<Message[]> {
        return this.apiService.get('http://127.0.0.1:8000' + '/messages-new/' + id + '/' + iduser);
    }

    save(mes: Message): Observable<Message> {
        let result: Observable<Message>;
        result = this.apiService.post('http://127.0.0.1:8000/messages', mes);
        return result;
    }

    cleanReserve (channel: number, user: number): Observable<any> {
        console.log('clean');
        return this.http.get('http://127.0.0.1:8000/clean-reserve/' + user + '/' + channel);
    }

//    initMessages(channel: string): any {
//        return this.http.get(settings.baseUrl + '/messages/' + channel).subscribe(res => {
//            this.pushMessages(res.data);
//        });
//    }
}
