import { Component, OnInit } from '@angular/core';
import {AuthService, User, UserService} from '@app/core';
import {ChatService} from '@app/core/services/chat.service';
import {Chat} from '@app/core/models/chat.model';
declare function require(path: string);

@Component({
  selector: 'app-chat-add',
  templateUrl: './chat-add.component.html',
  styleUrls: ['./chat-add.component.css'],
  // template: `<img src= "{{imageSrc}}"/>`
})
export class ChatAddComponent implements OnInit {
    users: Array<any>;
    imageSrc = require('./user.png');
    private currentUser: User;
    fixedUserId;
    fixedUser: User;
    newChat = {chatName: '', subscribers: []};
    empty = true;

    constructor(private authService: AuthService, private userService: UserService, private chatService: ChatService) { }

    ngOnInit() {
      this.authService.user.subscribe(data => this.currentUser = data);
      this.fixedUserId  =this.currentUser.id;
      this.chatService.getFriends().subscribe(data => {
          this.users = data;
          console.log(data);
      });
      this.newChat.subscribers = [];
    }

    fix(user: User) {
    this.fixedUserId = user.id;
    this.fixedUser = user;
    }

    add() {
        this.newChat.subscribers.push({'id': this.fixedUser.id});
        this.users = this.users.filter(item => item.id !== this.fixedUser.id);
        console.log(this.users);
        this.empty = false;
    }

    save() {
        //this.newChat.subscribers.push({'id': this.authService.getCurrentUser().id});
        this.chatService.createChat(this.newChat);
        console.log(this.newChat);
    }

}
