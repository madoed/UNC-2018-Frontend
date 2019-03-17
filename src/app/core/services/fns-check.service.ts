import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { environment } from '@env';
import { FnsReceipt, FnsCheckInfo } from '../models';


@Injectable({
  providedIn: 'root'
})
export class FnsCheckService {
  private FNS_API = environment.api_url + '/fns';

  constructor (
    private apiService: ApiService
  ) {}

  getCheckDetails(checkInfo: FnsCheckInfo): Observable<FnsReceipt> {
      return this.apiService.post(this.FNS_API + '/check-details', checkInfo);
  }
}
