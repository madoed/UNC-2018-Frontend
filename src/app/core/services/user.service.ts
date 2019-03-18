import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { environment } from '@env';
import { User, UserDetails } from '../models';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private USERS_API = environment.api_url + '/users';

    constructor (
        private apiService: ApiService
    ) {}

    add(user: User): Observable<User> {
        return this.apiService.post(this.USERS_API, user);
    }

    delete(id: number) {
        return this.apiService.delete(this.USERS_API + '/' +  id);
    }

    get(id: number): Observable<User> {
        return this.apiService.get(this.USERS_API + '/' +  id);
    }

    getAll (): Observable<User[]> {
        return this.apiService.get(this.USERS_API);
    }

    getOrCreate(userDetails: UserDetails): Observable<User> {
        return this.apiService.post(this.USERS_API, userDetails);
    }

    update(user: User): Observable<User> {
        return this.apiService.put(this.USERS_API + '/' + user.id, user);
    }
}
