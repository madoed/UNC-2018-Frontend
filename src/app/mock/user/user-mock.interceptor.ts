import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { Role, User } from '@app/core';

@Injectable()
export class UserMockInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let users: User[] = JSON.parse(localStorage.getItem('users')) ||
      [
        {
          id: 1,
          username: 'admin',
          password: 'admin',
          role: Role.Admin,
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
          role: Role.User,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          avatarUrl: 'https://cdn2.vectorstock.com/i/1000x1000/23/81/default-avatar-profile-icon-vector-18942381.jpg',
          aboutMe: 'I am a test user',
          friends: []
        }
      ];

      const authHeader = request.headers.get('Authorization');
      const isLoggedIn = authHeader && authHeader.startsWith('Token fake-jwt-token');
      const roleString = isLoggedIn && authHeader.split('.')[1];
      const role = roleString ? Role[roleString] : null;

      // wrap in delayed observable to simulate server api call
      return of(null).pipe(mergeMap(() => {

          // authenticate - public
          if (request.url.endsWith('users/authenticate') && request.method === 'POST') {
              const body = Object.assign({}, JSON.parse(request.body));
              const user = users.find(x => x.username === body.username && x.password === body.password);
              if (!user) return error('Username or password is incorrect');
              return ok({
                user,
                token: 'test-jwt-token',
                expiresIn: 3600
              });
          }

          // get user by id
          if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
              //if (!isLoggedIn) return unauthorised();

              // get id from request url
              let urlParts = request.url.split('/');
              let id = parseInt(urlParts[urlParts.length - 1]);

              // only allow normal users access to their own record
              /*const currentUser = users.find(x => x.role === role);
              if (id !== currentUser.id && role !== Role.Admin) return unauthorised();*/

              const user = users.find(x => x.id === id);
              return ok(user);
          }

          // get all users (admin only)
          if (request.url.endsWith('/users') && request.method === 'GET') {
              if (role !== Role.Admin) return unauthorised();
              return ok(users);
          }

          // register user
          if (request.url.endsWith('/users') && request.method === 'POST') {
            // get new user object from post body
            let newUser = Object.assign({}, JSON.parse(request.body));

            // validation
            let hasDuplicate = users.filter(user => { return user.username === newUser.username; }).length === 0 ? false : true;
            if (hasDuplicate) {
                return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
            }

            // save new user
            newUser.id = users.length + 1;
            newUser.role = Role.User;
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // respond 200 OK
            return of(new HttpResponse({ status: 200 }));
          }

          // update user
          if (request.url.endsWith('/users') && request.method === 'PUT') {
            let clonedUser = Object.assign({}, JSON.parse(request.body));
            let user = users.find(x => x.id === clonedUser.id);

            if (!user) {
              return throwError({ error: { message: 'user with id ' + clonedUser.id + ' doaesn\'t exist' } });
            }
            user = clonedUser;
            localStorage.setItem('users', JSON.stringify(users));
            return ok(user);
          }

          // delete user
          if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
            let urlParts = request.url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            let sizeBeforeDelete = users.length;
            users = users.filter((u: User) => u.id !== id);

            if (sizeBeforeDelete === users.length) {
                return throwError({ error: { message: 'user with id ' + id + ' wassn\'t found' } });
            }
            localStorage.setItem('users', JSON.stringify(users));

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
