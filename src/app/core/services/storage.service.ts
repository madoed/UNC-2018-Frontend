import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { environment } from '@env';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private STORAGE_API = environment.api_url + '/storage';

  constructor (
    private apiService: ApiService
  ) {}

  upload(file: File, filename: string) {
      let formData = new FormData(); 
      formData.append('file', file, filename);
      const headersJson = {
        'Do-Not-Set-Content-Type': 'true'
        }
      const headers: HttpHeaders = new HttpHeaders(headersJson);
      return this.apiService.postWithHeaders(this.STORAGE_API + '/upload', formData, headers);
  }

  download(filename: string) {
      return this.apiService.get(this.STORAGE_API + '/download/' + filename);
  }
}
