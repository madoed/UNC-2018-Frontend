import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from '@app/core/services/message.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';
import {Observable, Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ChatService} from '@app/core/services/chat.service';
import {AuthService, User} from '@app/core';
import {Message} from '@app/core/models/message.model';
import {Chat} from '@app/core/models/chat.model';
import {delay} from 'rxjs/operators';
//import {Message} from 'stompjs';
//import { StompService } from 'ng2-stomp-service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

    private serverUrl = 'http://127.0.0.1:8000/wechat';
    public filteredMessages: Array<Message> = [];
    private newMessage: string;
    private channel: Chat;
    private user: User;
    private stompClient;

    constructor( private messageService: MessageService,
                 private router: Router,
                 private chatService: ChatService,
                 private authService: AuthService) {

        this.channel = this.chatService.getChannel();
        this.user = this.authService.getCurrentUser();
        /*this.messageService.getMessages(this.channel.id).subscribe(data => {
            this.filteredMessages = data;
        });*/
    }

    sendMessage() {
        this.stompClient.send('/app/messages' , {},
            JSON.stringify( {'content': this.newMessage, 'from_chat': {'id': this.chatService.getChannel().id}, 'sender': this.user}));
        //$('#input').val('');
        //this.filteredMessages.push({'sender': this.username, 'content': this.newMessage});
        //this.messageService.save({'sender': this.authService.getCurrentUser(), 'content': this.newMessage, 'chat': this.chatService.getChannelId()}).subscribe(result => {this.gotoList(); },
         //   error => console.error(error));
        this.newMessage = '';
        this.scrollToBottom();
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
    }


    ngOnInit() {
        this.messageService.getMessages(this.channel.id).subscribe(data => {
            if (data.length === 0) {
                this.filteredMessages = []; } else {
                this.filteredMessages = data; }
        });
        this.delay(1000).then(any => {
            this.scrollToBottom();
        });

        this.channel = this.chatService.getChannel();
        this.user = this.authService.getCurrentUser();
        let ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.connect({}, frame => {
            that.stompClient.subscribe('/channel/' + this.channel.id, mes => {
                if(mes.body) {
                    let mymes = JSON.parse(mes.body);
                    console.log(mymes);
                    this.filteredMessages.push(mymes);
                    this.scrollToBottom();
                }
            });
        });

        this.scrollToBottom();
    }
/*
    filterMessages() {
        this.filteredMessages = this.messageService.filterMessages(this.channel);
        this.scrollToBottom();
    }*/

    scrollToBottom() {
        const msgContainer = document.getElementById('msg-container');
        msgContainer.scrollBy(0, 1000);
        //msgContainer.scrollTop = msgContainer.scrollHeight;
    }

   /* sendMessage() {
        if (this.newMessage) {
           this.stompClient.send('/app/messages', {'channel': '1'
                , 'sender': 1, 'content': this.newMessage});
            this.newMessage = '';
            this.scrollToBottom();
        }
    }

    filterMessages() {
        this.filteredMessages = this.messageService.filterMessages(this.channel);
        this.scrollToBottom();
    }

    scrollToBottom() {
        const msgContainer = document.getElementById('msg-container');
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }*/
}
