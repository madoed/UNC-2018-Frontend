import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { UserService, User } from '@app/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.get(id)
      .subscribe(user => this.user = user);
    console.log(this.user);
  }

}