
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
    defaultMeeting: 'assets/images/glass.png',
    keycloak: keycloakConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.