import { KeycloakConfig } from 'keycloak-angular';

let keycloakConfig: KeycloakConfig = {
    url: 'http://localhost:8180/auth',
    realm: 'meetup',
    clientId: 'meetup-frontend'
};

export const environment = {
    production: false,
    api_url: 'http://localhost:8000',
    defaultAvatar: 'assets/images/default.png',
    keycloak: keycloakConfig
};
