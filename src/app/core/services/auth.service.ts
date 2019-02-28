import { Injectable } from '@angular/core';
//import { KeycloakProfile } from 'keycloak-js';
//import { KeycloakService } from 'keycloak-angular';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { UserDetails } from '../models';

@Injectable()
export class AuthService {
    user: User;

    constructor(
      private userService: UserService,
      //private keycloakService: KeycloakService
    ) {}

    init() {
        if (this.isLoggedIn()) {
          //const userDetails: KeycloakProfile = await this.keycloakService.loadUserProfile();
          const payload: UserDetails = {
            id: "",
            username: "alice",
            firstName: "Alice",
            lastName: "Smith",
            email: "alice@example.com"
          };
          this.userService.getOrCreate(payload).subscribe(data => this.user = data);
        }
    }

    async logout() {
      //await this.keycloakService.logout();
    }

    async isLoggedIn() {
      return true;
      //return await this.keycloakService.isLoggedIn;
    }

    getToken(): Promise<string> {
      return null;
      //return this.keycloakService.getToken();
    }
  }
