import { Component, OnInit } from '@angular/core';
import {AuthService, Participant, User, UserService} from '@app/core';
import {ChatService} from '@app/core/services/chat.service';
import {Chat} from '@app/core/models/chat.model';
import {Router} from '@angular/router';
declare function require(path: string);
import {environment} from '@env';

@Component({
  selector: 'app-chat-add',
  templateUrl: './chat-add.component.html',
  styleUrls: ['./chat-add.component.css'],
  // template: `<img src= "{{imageSrc}}"/>`
})
export class ChatAddComponent implements OnInit {
    defaultAvatar = environment.defaultAvatar;
    users: Array<any>;
    imageSrc = require('./user.png');
    fixedUserId;
    fixedUser: User;
    newChat = {chatName: '', subscribers: []};
    empty = true;

    constructor(private authService: AuthService,
                private userService: UserService,
                private chatService: ChatService,
                private router: Router) { }

    ngOnInit() {
      this.fixedUserId  = this.authService.user.id;
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

    delete(userToAdd: User) {
        this.newChat.subscribers = this.newChat.subscribers.filter(item => item.id !== userToAdd.id);
        if (!this.newChat.subscribers.length) {
            this.newChat.subscribers = [];
            this.empty = true;
        }
    }

    checkIfAdded(userToAdd: User): boolean {
        if (this.newChat.subscribers.filter(item => item.id === userToAdd.id).length) {
            return true;
        }
        return false;
    }

    add(userToAdd: User) {
        this.newChat.subscribers.push({'id': userToAdd.id});
        //this.users = this.users.filter(item => item.id !== this.fixedUser.id);
        console.log(this.users);
        this.empty = false;
    }

    gotoList() {
        this.router.navigate(['/chat']);
    }

    save() {
        this.newChat.subscribers.push({'id': this.authService.user.id});
        //this.newChat.subscribers.push({'id': this.authService.getCurrentUser().id});
        this.chatService.createChat(this.newChat).subscribe(result => {
            this.gotoList();
        }, error => console.error(error));

    }

}
