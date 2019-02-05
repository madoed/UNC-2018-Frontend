import { Component, OnInit } from '@angular/core';

import { User, UserService } from '@app/core';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {
  selectedUser: User;
  users: Array<User>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers(): void {
      this.userService.getAll()
      .subscribe(users => this.users = users);
    }

  onSelect(user: User): void {
    this.selectedUser = user;
  }
}
