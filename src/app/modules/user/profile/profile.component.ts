import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AuthService, User } from '@app/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  defaultAvatar = "http://localhost:8000/images/default.png";
  user: User;
  currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe(data => this.currentUser = data);
    this.authService.user.subscribe(data => this.user = data);
    /*this.currentUser = await this.authService.user;
    this.user = await this.authService.user;*/
  }
}
