import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject, ReplaySubject } from 'rxjs';

import { JwtService } from './jwt.service';
import { UserService } from './user.service';
import { User } from '../models';
import { map ,  distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private jwtService: JwtService,
    private userService: UserService
  ) {
    this.isAuthenticatedSubject.next(false);
  }

  private setAuth(user: User, token: string, expiresIn: number) {
    this.jwtService.saveToken(token, expiresIn);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    console.log('logged in as ' + user.username);
  }

  logout() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
    console.log('logged out');
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.userService.authenticate(username, password)
        .pipe(map(response => {
            if (response && response.token && response.user) {
              this.setAuth(response.user, response.token, response.expiresIn);
            }
            return response.user;
        }));
  }

  register(user: User): Observable<User> {
    return this.userService.add(user);
  }
}
