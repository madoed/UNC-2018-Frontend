import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChannelService {

    private channel = new Subject<string>();



    refreshChannel(channel: string) {
        this.channel.next(channel);
    }

    removeChannel() {
        this.channel.next();
    }

    getChannel(): Observable<any> {
        return this.channel.asObservable();
    }
}
