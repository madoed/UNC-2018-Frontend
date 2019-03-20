import { Injectable } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { UserDetails } from '../models';

@Injectable()
export class AuthService {
    userDetails: UserDetails;
    userPromise: Promise<User>;
    user: User;

    constructor(
        private userService: UserService,
        private keycloakService: KeycloakService
    ) {}

    async init() {
        if (this.isLoggedIn()) {
            const keycloakDetails: KeycloakProfile = await this.keycloakService.loadUserProfile();
            this.userDetails = {
                id: keycloakDetails.id,
                username: keycloakDetails.username,
                firstName: keycloakDetails.firstName,
                lastName: keycloakDetails.lastName,
                email: keycloakDetails.email
            };
            this.userPromise = this.getCurrentUser();
            this.user = await this.userPromise;
        }
    }

    async logout() {
        await this.keycloakService.logout();
    }

    async isLoggedIn() {
        return await this.keycloakService.isLoggedIn;
    }

    getToken(): Promise<string> {
        return this.keycloakService.getToken();
    }

    getCurrentUser(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.userService.getOrCreate(this.userDetails).subscribe(success => {
                resolve(success);
            });
        });
    }
}
