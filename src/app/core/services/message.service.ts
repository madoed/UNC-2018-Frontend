import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiService} from './api.service';
import {Message} from '../models/message.model';
import {Chat} from '../models/chat.model';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private messages: Array<Message> = [];
    private msgs = new Subject<Array<Message>>();

    constructor(private apiService: ApiService) {}

    push(message: Message) {
        this.messages.push(message);
        this.msgs.next(this.messages);
    }

//    pushMessages(messages: Array<any>) {
//        this.messages.push(message);
//        this.msgs.next(this.messages);
//    }

    filterMessages(channel: Chat): Array<Message> {
        return this.messages.filter(message => channel === message.from_chat)
            .sort((m1, m2) => {
                if (m1.timestamp > m2.timestamp) {
                    return 1;
                }

                return -1;
            });
    }
/*
    sendReadReceipt(channelId: string, username: string) {
        this.apiService.post('http://127.0.0.1:8000' + '/messages/', {
            channel: channelId,
            username: username
        });
    }*/

    getMessages(id: number): Observable<Message[]> {
        return this.apiService.get('http://127.0.0.1:8000' + '/messages/' + id);
    }

    save(mes: Message): Observable<Message> {
        let result: Observable<Message>;
        result = this.apiService.post('http://127.0.0.1:8000/messages', mes);
        return result;
    }

//    initMessages(channel: string): any {
//        return this.http.get(settings.baseUrl + '/messages/' + channel).subscribe(res => {
//            this.pushMessages(res.data);
//        });
//    }
}
