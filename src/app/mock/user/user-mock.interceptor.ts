import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { Role, User } from '@app/core';

@Injectable()
export class UserMockInterceptor implements HttpInterceptor {
    users: User[] =
    [
      {
        id: 1,
        username: 'admin',
        password: 'admin',
        firstName: 'Super',
        lastName: 'User',
        email: 'admin@example.com',
        avatarUrl: '',
        aboutMe: '',
        friends: []
      },
      {
        id: 11,
        username: '1',
        password: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png',
        aboutMe: 'I am a test user',
        friends: []
      }
    ];

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.users = JSON.parse(localStorage.getItem('users')) || this.users;
      let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));;
      const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MzYwMCwicm9sZSI6ImFkbWluIn0.5BWuIPcbCjVhfbrtxa2Jp9c8LvcFW23enSmd_I9y9Bc';
      const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MzYwMCwicm9sZSI6InVzZXIifQ.OPTHU5lgvhiwZ7cyWhyVniGourKKKPlZ7ZCDliTKqgw';

      /*const authHeader = request.headers.get('Authorization');
      const isLoggedIn = authHeader && authHeader.startsWith('Token fake-jwt-token');
      const roleString = isLoggedIn && authHeader.split('.')[1];
      const role = roleString ? Role[roleString] : null;*/

      // wrap in delayed observable to simulate server api call
      return of(null).pipe(mergeMap(() => {// get current user
          // get current user
          if (request.url.endsWith('/auth') && request.method === 'GET') {
              return ok({
                user: currentUser,
                token: adminToken
              });
          }

          // login
          if (request.url.endsWith('auth/login') && request.method === 'POST') {
              const body = Object.assign({}, JSON.parse(request.body));
              const user = this.users.find(x => x.username === body.username && x.password === body.password);
              if (!user) return error('Username or password is incorrect');
              localStorage.setItem('currentUser', JSON.stringify(user));
              return ok({
                user: user,
                token: adminToken
              });
          }

          // logout
          if (request.url.match('auth/logout') && request.method === 'POST') {
            localStorage.removeItem('currentUser');
            return of(new HttpResponse({ status: 200 }));
          }

          // get user by id
          if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
              // get id from request url
              let urlParts = request.url.split('/');
              let id = parseInt(urlParts[urlParts.length - 1]);

              // only allow normal users access to their own record
              /*const currentUser = users.find(x => x.role === role);
              if (id !== currentUser.id && role !== Role.Admin) return unauthorised();*/

              const user = this.users.find(x => x.id === id);
              return ok(user);
          }

          // get all users
          if (request.url.endsWith('/users') && request.method === 'GET') {
              //if (role !== Role.Admin) return unauthorised();
              return ok(this.users);
          }

          // register user
          if (request.url.endsWith('/users') && request.method === 'POST') {
            // get new user object from post body
            let newUser = Object.assign({}, JSON.parse(request.body));

            // validation
            let hasDuplicate = this.users.filter(user => { return user.username === newUser.username; }).length === 0 ? false : true;
            if (hasDuplicate) {
                return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
            }

            // save new user
            newUser.id = this.users.length + 1;
            newUser.role = Role.User;
            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));

            // respond 200 OK
            return of(new HttpResponse({ status: 200 }));
          }

          // update user
          if (request.url.endsWith('/users') && request.method === 'PUT') {
            let clonedUser = Object.assign({}, JSON.parse(request.body));
            let user = this.users.find(x => x.id === clonedUser.id);

            if (!user) {
              return throwError({ error: { message: 'user with id ' + clonedUser.id + ' doaesn\'t exist' } });
            }
            user = clonedUser;
            localStorage.setItem('users', JSON.stringify(this.users));
            return ok(user);
          }

          // delete user
          if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
            let urlParts = request.url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            let sizeBeforeDelete = this.users.length;
            this.users = this.users.filter((u: User) => u.id !== id);

            if (sizeBeforeDelete === this.users.length) {
                return throwError({ error: { message: 'user with id ' + id + ' wassn\'t found' } });
            }
            localStorage.setItem('users', JSON.stringify(this.users));

            // respond 200 OK
            return of(new HttpResponse({ status: 200 }));
          }

          // pass through any requests not handled above
          return next.handle(request);
        }))
        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());

        // private helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}
