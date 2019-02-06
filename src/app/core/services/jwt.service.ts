import { Injectable } from '@angular/core';
import * as moment from "moment";


@Injectable()
export class JwtService {
  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }

  getToken(): String {
    return window.localStorage['token'];
  }

  public hasExpired() {
      return moment().isAfter(this.getExpiration());
}

  saveToken(token: String, expiresIn: number) {
    const expiresAt = moment().add(expiresIn,'second');
    window.localStorage['token'] = token;
    window.localStorage['expires_at'] = JSON.stringify(expiresAt.valueOf());
  }

  destroyToken() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expires_at');
  }
}
