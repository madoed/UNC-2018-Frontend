import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {environment} from '@env';
//import {Message} from 'stompjs';
//import { StompService } from 'ng2-stomp-service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy{

    public opponent: User;
    defaultAvatar = environment.defaultAvatar;
    private serverUrl = 'http://127.0.0.1:8000/wechat';
    public filteredMessages: Array<Message> = [];
    public newMessages: Array<Message> = [];
    private newMessage: string;
    private channel = {}as Chat;
    private user: User;
    private stompClient;
    timer: number = 120000;

    sub: Subscription;

    constructor( private messageService: MessageService,
                 public router: Router,
                 public chatService: ChatService,
                 private authService: AuthService,
                 public route: ActivatedRoute) {

        //this.channel = this.chatService.getChannel();
        //this.user = this.authService.getCurrentUser();


        /*this.messageService.getMessages(this.channel.id).subscribe(data => {
            this.filteredMessages = data;
        });*/
    }

    back() {
        //let ws = new SockJS(this.serverUrl);
        //this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.disconnect(frame => {
            that.stompClient.subscribe('/channel/' + this.channel.id); }, {});
        console.log('unsub');
        this.delay(100).then( res => {
                this.router.navigate(['/chat']);
            }
        );
    }

    sendMessage() {

        if (!this.stompClient.connected) {
            let ws = new SockJS(this.serverUrl);
            this.stompClient = Stomp.over(ws);
            let that = this;
            this.stompClient.connect({}, frame => {
                that.stompClient.subscribe('/channel/' + this.channel.id, mes => {
                    if (mes.body) {
                        let mymes = JSON.parse(mes.body);
                        console.log(mymes);
                        this.filteredMessages.push(mymes);
                        this.messageService.cleanReserve(this.channel.id, this.authService.user.id);
                        this.scrollToBottom();
                        this.delay(600).then(any => {
                            this.scrollToBottom();
                            this.delay(600).then(any2 => {
                                this.scrollToBottom();
                            });
                        });
                        this.timer += 60000;
                    }
                });
            });
            this.delay(700).then(any => {
                //this.user.friends = [];
                this.stompClient.send('/app/messages', {},
                    JSON.stringify({'content': this.newMessage,
                        'from_chat': {'id': this.channel.id, 'chatName': this.channel.chatName}, 'sender': this.user}));
                this.newMessage = '';
                this.scrollToBottom();
                this.timer += 60000;
            });
            this.timer = 120000;
            // this.delay(this.timer).then( res => {
            //         //this.stompClient.unsubscribe('/channel/' + this.channel.id);
            //         this.stompClient.disconnect(frame => {
            //             that.stompClient.subscribe('/channel/' + this.channel.id); }, {});
            //         console.log('unsub');
            //     }
            // );

        } else {
            this.user.friends = [];
            this.stompClient.send('/app/messages' , {},
                JSON.stringify( {'content': this.newMessage, 'from_chat': {'id': this.channel.id,
                        'chatName': this.channel.chatName}, 'sender': this.user}));
            //$('#input').val('');
            //this.filteredMessages.push({'sender': this.username, 'content': this.newMessage});
            //this.messageService.save({'sender': this.authService.getCurrentUser(), 'content': this.newMessage, 'chat': this.chatService.getChannelId()}).subscribe(result => {this.gotoList(); },
            //   error => console.error(error));
            this.newMessage = '';
            this.scrollToBottom();
            this.timer += 60000;
        }
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() =>
            console.log("fired"));
    }

    ngOnDestroy() {
        let that = this;
        this.stompClient.disconnect(frame => {
            that.stompClient.subscribe('/channel/' + this.channel.id); }, {});
        console.log('unsub');
    }

    ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
          this.chatService.getChannel(id).subscribe((chat: any) => {
            if (chat) {
              this.chatService.setChannel(chat);
              this.channel = chat;
              this.user = this.authService.user;
              if (this.channel.chatType === 'dialogue') {
                  this.getNotYou();
              }
              this.setUpChat();
            } else {
              console.log(`Card with id '${id}' not found, returning to list`);
            }
          });
        }
      });

        //this.scrollToBottom();
    }
/*
    filterMessages() {
        this.filteredMessages = this.messageService.filterMessages(this.channel);
        this.scrollToBottom();
    }*/

    async setUpChat() {
      this.messageService.getOldMessages(this.channel.id, this.authService.user.id).subscribe(data => {
        if (data) {
            this.filteredMessages = data;
            this.messageService.getNewMessages(this.channel.id, this.authService.user.id).subscribe(newmes => {
                if (newmes) {
                    newmes.forEach(mes => {
                        this.filteredMessages.push(mes);
                    });
                    this.newMessages = newmes;
                    this.delay(600).then(any => {
                        this.scrollToBottom();
                        this.delay(600).then(any2 => {
                            this.scrollToBottom();
                        });
                    });
                } else {
                    this.newMessages = [];
                    this.delay(600).then(any => {
                        this.scrollToBottom();
                        this.delay(600).then(any2 => {
                            this.scrollToBottom();
                        });
                    });
                }
            });
        } else {
            this.messageService.getNewMessages(this.channel.id, this.authService.user.id).subscribe(newmes => {
                if (newmes) {
                    this.filteredMessages = newmes;
                    this.newMessages = newmes;
                    this.delay(600).then(any => {
                        this.scrollToBottom();
                        this.delay(600).then(any2 => {
                            this.scrollToBottom();
                        });
                    });
                } else {
                    this.newMessages = [];
                    this.filteredMessages = [];
                    this.delay(600).then(any => {
                        this.scrollToBottom();
                        this.delay(600).then(any2 => {
                            this.scrollToBottom();
                        });
                    });
                }
            });
        }

          this.delay(4000).then(any => {
              this.newMessages = [];
          });
      });

        // this.delay(10000).then(any => {
        //    this.newMessages = [];
        // });

      console.log(this.channel);
      this.user = this.authService.user;
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      let that = this;
      this.stompClient.connect({}, frame => {
        that.stompClient.subscribe('/channel/' + this.channel.id, mes => {
          if(mes.body) {
            let mymes = JSON.parse(mes.body);
            console.log(mymes);
            this.filteredMessages.push(mymes);
            this.messageService.cleanReserve(this.channel.id, this.authService.user.id).subscribe(p => {
                console.log('cleaned');
            });
            this.scrollToBottom();
              this.delay(600).then(any => {
                  this.scrollToBottom();
              });
              this.timer += 60000;
          }
        });
      });

      // this.delay(this.timer).then( res => {
      //         //this.stompClient.unsubscribe('/channel/' + this.channel.id);
      //         this.stompClient.disconnect(frame => {
      //             that.stompClient.subscribe('/channel/' + this.channel.id); }, {});
      //         console.log('unsub');
      // }
      // );
    }

    parser(value: any): String | '' {
        if ((typeof value === 'string')) {
            const str = value.split('-');
            const year = str[0];
            const month = str[1];
            const date = (Number(str[2].split('T')[0])).toString();
            return date + '/ ' + month + '/ ' + year;
        }
        return '';
    }

    checkIfNew(mes: Message): boolean {
            if ( this.newMessages === undefined) {
                return false;
            }
            return this.newMessages.includes(mes);
    }

    scrollToBottom() {
        const msgContainer = document.getElementById('msg-container');
        msgContainer.scrollBy(0, 6000);
        //msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    getNotYou() {
        this.channel.subscribers.forEach(sub => {
            if (sub.id !== this.authService.user.id) {
                this.opponent = sub;
            }
        });
    }

    getAmountOfRows(str: String): number {
        let amount = Math.round(str.length / 50) + 1;
        let sub = str;
        while (sub.indexOf('\n', 0) >= 0) {
            amount = amount + 1;
            sub = sub.substr(sub.indexOf('\n', 0) + 1 );
        }
        return amount + 1;
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
