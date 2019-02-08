import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiService} from '@app/core';

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

    filterMessages(channel: string): Array<Message> {
        return this.messages.filter(message => channel === message.channel)
            .sort((m1, m2) => {
                if (m1.timestamp > m2.timestamp) {
                    return 1;
                }

                return -1;
            });
    }

    sendReadReceipt(channelId: string, username: string) {
        this.apiService.post('http://127.0.0.1:8000' + '/messages/', {
            channel: channelId,
            username: username
        });
    }

    getMessages(id: string): Observable<any> {
        return this.apiService.get('http://127.0.0.1:8000' + '/messages/' + id);
    }

    //get all messages from chat
    get(id: string): Observable<any> {
        return this.apiService.get('http://127.0.0.1:8000' + '/messages' + id);
    }

    save(mes: any): Observable<any> {
        let result: Observable<Object>;
        result = this.apiService.post('http://127.0.0.1:8000/messages', mes);
        return result;
    }

//    initMessages(channel: string): any {
//        return this.http.get(settings.baseUrl + '/messages/' + channel).subscribe(res => {
//            this.pushMessages(res.data);
//        });
//    }
}
