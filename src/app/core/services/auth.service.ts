import { Injectable } from '@angular/core';
//import { KeycloakProfile } from 'keycloak-js';
//import { KeycloakService } from 'keycloak-angular';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { UserDetails } from '../models';

@Injectable()
export class AuthService {
    userDetails: UserDetails;
    user: User;

    constructor(
      private userService: UserService,
      //private keycloakService: KeycloakService
    ) {}

    async init() {
        if (this.isLoggedIn()) {
          //this.userDetails = await this.keycloakService.loadUserProfile();
          this.userDetails = {
            id: "57301afa-2110-41f9-8cd7-09d0dccefb7a",
            username: "alice",
            firstName: "Alice",
            lastName: "Smith",
            email: "alice@example.com"
          };
        //     if (this.isLoggedIn()) {
        //         //this.userDetails = await this.keycloakService.loadUserProfile();
        //         this.userDetails = {
        //             id: "ooo",
        //             username: "bob",
        //             firstName: "Bob",
        //             lastName: "Wilde",
        //             email: "bob@example.com"
        //         };
          this.user = await this.getCurrentUser();
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

    getCurrentUser(): Promise<User> {
      return new Promise<User>((resolve, reject) => {
        this.userService.getOrCreate(this.userDetails).subscribe(success => {
          resolve(success);
        });
      });
    }
  }
