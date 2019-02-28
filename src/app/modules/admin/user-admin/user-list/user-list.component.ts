import { Component, OnInit } from '@angular/core';

import { User, UserService } from '@app/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  selectedUser: User;
  users: Array<User>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers(): void {
      this.userService.getAll().subscribe(users => this.users = users);
    }

  onSelect(user: User): void {
    this.selectedUser = user;
  }
}
