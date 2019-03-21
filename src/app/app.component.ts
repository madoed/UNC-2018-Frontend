import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AuthService, Chat, ChatService, MessageService, User} from '@app/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {MessageService as mes} from 'primeng/api';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'meetup';
  mes: number = 0;
  mesUpdates: Array<number> = [];
  private stompClient;
  private serverUrl = 'http://127.0.0.1:8000/wechat';
  sub: Subscription;
  chatOn: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messService: mes,
    public chatService: ChatService,
    public route: ActivatedRoute
  ) {}

  async ngOnInit() {
      await this.authService.init();
      this.chatService.getNew(this.authService.user.id).subscribe( up => {
        if (up) {
            up.forEach(u => {
                this.mesUpdates.push(u.id);
                this.mes = this.mes + 1;
            });
        }
      });
      this.router.events.subscribe(url => {
        if (url instanceof NavigationEnd) {
            let str = this.router.url.split('/');
            if (str[str.length - 2] === 'start') {
                this.chatOn = Number(str[str.length - 1]);
                console.log(this.chatOn);
                if (this.mesUpdates.find(t => t === this.chatOn)) {
                    this.mesUpdates = this.mesUpdates.filter(t => t !== this.chatOn);
                    this.mes = this.mes - 1;
                }
            } else if (str[str.length - 2] === 'meeting-main' || str[str.length - 2] === 'meeting-participant') {
                let meetId = Number(str[str.length - 1]);
                this.chatService.getMeetingChatId(meetId).subscribe(t => {
                    this.chatOn = t;
                    if (this.mesUpdates.find(m => m === this.chatOn)) {
                        this.mesUpdates = this.mesUpdates.filter(n => n !== this.chatOn);
                        this.mes = this.mes - 1;
                    }
                });
            } else {
                this.chatOn = 0;
            }
        }
      });
      // this.router.events.subscribe((event) => {
      //     console.log(event);
      //     if(event.url) {
      //         console.log(event.url);
      //     }
      // });

      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      let that = this;
      this.stompClient.connect({}, frame => {
          that.stompClient.subscribe('/user-notify/' + this.authService.user.id, mes => {
              if (mes.body) {
                  let chatOpened = 0;
                  let curUrl= this.router.url;
                  let parts = curUrl.split('/');
                  chatOpened = Number(parts[ parts.length - 1]);
                  let str;
                  let mymes = JSON.parse(mes.body);
                  console.log(mymes);
                  if (this.chatOn !== mymes.from_chat.id && chatOpened !== mymes.from_chat.id
                      && this.authService.user.id !== mymes.sender.id) {
                      if (mymes.from_chat.chatType === 'dialogue') {
                          str = 'new Message from ' + mymes.sender.firstName + ' ' + mymes.sender.lastName;
                      } else {
                          str = 'new Message in \"' + mymes.from_chat.chatName + '\"';
                      }
                      this.messService.add({severity: 'info', detail: str});
                      if (!this.mesUpdates.find(m => m === mymes.from_chat.id)) {
                        this.mesUpdates.push(mymes.from_chat.id);
                        this.mes = this.mes + 1;
                      }
                  }
              }
          });
      });
  }
}
