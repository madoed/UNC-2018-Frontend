import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Role, User } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService implements InMemoryDbService {
  createDb() {
      const users = [
        {
          id: 1,
          username: 'admin',
          password: 'admin',
          role: Role.Admin,
          token: 'admin-token'
        },
        {
          id: 11,
          username: 'johnny',
          password: 'qwerty',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          role: Role.User,
          token: 'user-11-token'
        }
      ];
      return { users };
    }

    genId(users: User[]): number {
      return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 11;
    }
}
