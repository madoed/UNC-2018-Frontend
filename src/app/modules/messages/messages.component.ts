import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from '@app/core/services/message.service';
import {ChannelService} from '@app/core/services/channel.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
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
    private channel: string;
    private username = "Nina";
    private stompClient;
    formGroup: FormGroup;

    constructor( private messageService: MessageService, private router: Router, private fb: FormBuilder) {
        let ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        let that = this;

        this.stompClient.connect({}, frame => {
            that.stompClient.subscribe('/channel1/', mes => {
                if(mes.body) {
                    let mymes = JSON.parse(mes.body);
                    this.filteredMessages.push(mymes);
                    //console.log(mymes.sender);
                    console.log(mes.body);
                }
            });
        });
    }

    sendMessage() {
        this.formGroup = this.fb.group({
            content: this.newMessage,
            sender: this.username
        });
        this.stompClient.send('/app/messages' , {}, JSON.stringify( {'sender': this.username, 'content': this.newMessage}));
        //$('#input').val('');
        //this.filteredMessages.push({'sender': this.username, 'content': this.newMessage});
        this.messageService.save({'sender': this.username, 'content': this.newMessage}).subscribe(result => {this.gotoList(); },
            error => console.error(error));
        this.newMessage = '';
        this.scrollToBottom();
    }

    gotoList() {
    }

    ngOnInit() {
        this.messageService.getMessages('1').subscribe(messages => {
            this.filteredMessages = messages;
        });
        this.scrollToBottom();

       /* this.channelService.getChannel().subscribe(channel => {
            this.channel = 'mychat';
            this.filterMessages();
        });

        this.messageService.getMessages().subscribe(messages => {
            this.filterMessages();
        });
*/
        //this.messageService.getMessages().subscribe(messages => {
        //    this.filterMessages();
        //});
    }

    scrollToBottom() {
        const msgContainer = document.getElementById('msg-container');
        msgContainer.scrollTop = msgContainer.scrollHeight;
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
