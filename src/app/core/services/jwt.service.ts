import { Injectable } from '@angular/core';
import * as moment from "moment";


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  getExpiration() {
      const expiresAt = JSON.parse(localStorage.getItem("exp"));
      return moment(expiresAt);
  }

  getToken(): String {
    return window.localStorage['token'];
  }

  public hasExpired() {
      return moment().isAfter(this.getExpiration());
}

  saveToken(token: String, expiresIn: number) {
    const expiresAt = moment().add(expiresIn, 'second');
    window.localStorage['token'] = token;
    window.localStorage['exp'] = JSON.stringify(expiresAt.valueOf());
  }

  destroyToken() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('exp');
  }
}
