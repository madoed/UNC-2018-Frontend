import { Component, OnInit } from '@angular/core';
import {AuthService} from '@app/core';
import {ChatService} from '@app/core/services/chat.service';
import {Observable, Subject} from 'rxjs';
import {Chat} from '@app/core/models/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    chats: Array<Chat>;

    constructor(private chatService: ChatService, private authService: AuthService) {
    }

    ngOnInit() {
        this.chatService.getAll().subscribe(data => {
            this.chats = data;
        });
    }

    startChat(chat: Chat) {
        this.chatService.setChannel(chat);
    }
}

