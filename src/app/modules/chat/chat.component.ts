import { Component, OnInit } from '@angular/core';
import {AuthService} from '@app/core';
import {ChatService} from '@app/core/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    chats: Array<any>;

    constructor(private chatService: ChatService, private authService: AuthService) {
    }

    ngOnInit() {
        this.chatService.getAll().subscribe(data => {
            this.chats = data;
        });
    }
}

