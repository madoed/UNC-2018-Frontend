import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { JwtService, UserService, User } from '@app/core';
import { map ,  distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  public isAuthenticated = false;

  constructor (
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  private setAuth(user: User, token: string) {
    this.jwtService.saveToken(token);
    this.currentUserSubject.next(user);
    this.isAuthenticated = true;
    console.log('logged in as ' + user.username);
  }

  logout() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticated = false;
    console.log('logged out');
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.userService.authenticate(username, password)
        .pipe(map(response => {
            if (response && response.token && response.user) {
              this.setAuth(response.user, response.token);
            }
            return response.user;
        }));
  }

  register(user: User): Observable<User> {
    return this.userService.add(user);
  }
}
