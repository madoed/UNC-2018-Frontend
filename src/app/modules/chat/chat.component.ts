import { Component, OnInit } from '@angular/core';
import {AuthService, User} from '@app/core';
import {ChatService} from '@app/core/services/chat.service';
import {Observable, Subject} from 'rxjs';
import {Chat} from '@app/core/models/chat.model';
import {Router} from '@angular/router';
import {environment} from '@env';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    defaultAvatar = environment.defaultAvatar;
    chats: Array<Chat>;
    newChats: Array<Chat>;

    constructor(private chatService: ChatService,
                private authService: AuthService,
                private router:  Router) {
    }

    ngOnInit() {
        this.chatService.getNew().subscribe(data => {
            if (data) {
                console.log(this.newChats);
                this.newChats = data;
                this.chats = data;
                this.chatService.getOld().subscribe(oldchats => {
                    if (oldchats) {
                        oldchats.forEach(chat => {
                            this.chats.push(chat);
                        });
                    }
                });
            } else {
                this.chatService.getOld().subscribe(oldchats => {
                    if (oldchats) {
                        this.chats = oldchats;
                    } else {
                        this.chats = [];
                    }
                });
                this.newChats = [];
            }
        });
    }

    getNotYou(chat: Chat): User {
        let user;
        chat.subscribers.forEach(sub => {
            if (sub.id !== this.authService.user.id) {
                user = sub;
            }
        });
        return user;
    }

    checkIfNew(chat: Chat): boolean {
        if ( this.newChats === undefined) {
            return false;
        }
        return this.newChats.includes(chat);
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

     cutLine(line: string): string {
        if (line.length > 40) {
            let str = line.substr(0, 40) + '...';
            return str;
        }
        return line;
     }

     openChat(id: number) {
        this.router.navigate(['/chat/start', id]);
     }

    startChat(chat: Chat) {
        this.chatService.setChannel(chat);
    }
}

