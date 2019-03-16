import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthService, UserService, User } from '@app/core';
import { MessageService } from 'primeng/api';
import { environment } from '@env';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  defaultAvatar = environment.defaultAvatar;
  user: User= {} as User;
  currentUser: User= {} as User;
  userInfo = new Map();
  private friendId: number;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getCurrentUser();
    this.getUser();
  }

  getCurrentUser() {
    this.currentUser = this.authService.user;
  }

  getUser() {
    this.route.params.forEach(params => {
      const id = params['id'];
      this.userService.get(id).subscribe(user => {
        this.user = user;
        this.setUserInfo(this.user);
      });
    });
  }

  isFriend() {
    if (this.user.id === this.currentUser.id)
      return false;
    let ids = [];
    this.currentUser.friends.forEach(friend => {
      ids.push(friend.id);
    });
    return ids.indexOf(this.user.id) !== -1;
  }

  setUserInfo(user: User) {
    this.userInfo.set("First Name", user.firstName);
    this.userInfo.set("Last Name", user.lastName);
    this.userInfo.set("User Name", user.username);
    this.userInfo.set("Email", user.email);
    this.userInfo.set("About Me", user.aboutMe);
  }

  unfriend(friend) {
    this.friendId = friend.id;
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?',
    detail:'Do you want to unfriend ' + friend.firstName + ' ' + friend.lastName + '?'});
  }
  
  onConfirm() {
    this.messageService.clear('c');
    this.currentUser.friends = this.user.friends.filter(f => this.friendId !== f.id);
    this.updateCurrentUser();
    let element = document.getElementById("friend " + this.friendId);
    element.remove();
  }

  onReject() {
    this.messageService.clear('c');
  }

  addFriend() {
    if (!this.isFriend()) {
      this.getUser();
      this.currentUser.friends.push(this.user);
      this.updateCurrentUser();
    }
  }

  updateCurrentUser() {
    this.userService.update(this.currentUser).subscribe(
      u => {
        this.authService.user = u;
        this.currentUser = u;
      });
  }
}
