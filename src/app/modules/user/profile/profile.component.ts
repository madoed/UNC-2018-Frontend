import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, UserService, User, ChatService} from '@app/core';
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
  private status: string;
  private months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private chatService: ChatService,
    private router: Router,
  ) { }

  async ngOnInit() {
    await this.getCurrentUser();
    this.getUser();
  }

  async getCurrentUser() {
    this.currentUser = await this.authService.userPromise;
  }

  getUser() {
    this.route.params.forEach(params => {
      const id = params['id'];
      if (id == 'profile') {
        this.user = this.authService.user;
        this.setUserInfo(this.user);
      } else {
        this.userService.get(id).subscribe(
          user => {
            this.user = user;
            this.setUserInfo(this.user);
            var date = undefined;
            if (user.lastVisit)
              date = new Date(Date.parse(user.lastVisit.toString()));
              const lastVisit: string = date ? "Last seen on " + this.months[date.getMonth()] + ' ' + date.getDate() + ', '
                  + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() : undefined;
              this.status = user.online ? "online" : lastVisit;
          },
          error => {
            console.log(error);
            this.router.navigate(["/"]);
          }
        );
      }
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

  sendMess(friend: number) {
    this.chatService.getDialogue(friend, this.authService.user.id).subscribe(res => {
       this.router.navigate(['/chat/start', res.id]);
    });
  }
}
