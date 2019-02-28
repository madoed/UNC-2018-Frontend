import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject, ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { UserService } from './user.service';
import { User } from '../models';
import { environment } from '@env';
import { map , distinctUntilChanged } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private AUTH_API = environment.api_url + 'auth';

  constructor (
    private apiService: ApiService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.get(this.AUTH_API)
      .subscribe(
        data => {
          this.setAuth(data.user, data.token, data.expiresIn);
        },
        err => {
          console.log(err);
          this.purgeAuth();
        }
      );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.apiService.post(this.AUTH_API + '/login', { username, password })
        .pipe(map(response => {
            if (response && response.token && response.user) {
              this.setAuth(response.user, response.token, response.expiresIn);
            }
            console.log('logged in as ' + response.user.username);
            return response.user;
        }));
  }

  logout() {
    this.apiService.post(this.AUTH_API + '/logout');
    this.purgeAuth();
    console.log('logged out');
  }

  register(user: User): Observable<User> {
    return this.userService.add(user);
  }

  private setAuth(user: User, token: string, expiresIn: number) {
    this.jwtService.saveToken(token, expiresIn);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
  }
}
