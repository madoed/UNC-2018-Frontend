import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AuthService, UserService, User } from '@app/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  defaultAvatar = "http://localhost:8000/images/default.png";
  user: User={}as User;
  currentUser: User={}as User;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.user;
    this.route.params.forEach(params => {
      const id = params['id'];
      this.userService.get(id).subscribe(user => this.user = user);
    });
    //const id = +this.route.snapshot.paramMap.get('id');
    //this.userService.get(id).subscribe(user => this.user = user);
  }
}
