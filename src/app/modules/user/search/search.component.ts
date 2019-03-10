import { Component, OnInit } from '@angular/core';
import { User, UserService, AuthService } from '@app/core';
import { SelectItem } from 'primeng/primeng';
import { environment } from '@env';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  defaultAvatar = environment.defaultAvatar;
  currentUser: User;
  users: User[];

  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.user;
    this.userService.getAll().subscribe(
      data => this.users = data.filter(u => u.id !== this.currentUser.id)
    );
    this.sortOptions = [
      {label: 'Name', value: 'firstName'},
      {label: 'User Name', value: 'username'}
  ];
  }

  isFriend(user: User) {
    if (user.id === this.currentUser.id)
      return false;
    let ids = [];
    this.currentUser.friends.forEach(friend => {
      ids.push(friend.id);
    });
    return ids.indexOf(user.id) !== -1;
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
  } 
}
