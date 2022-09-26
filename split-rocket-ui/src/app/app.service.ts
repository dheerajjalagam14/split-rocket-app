import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  calculateExpenses(data: any) {
    return this.http.post(this.rootURL + '/calculate', data);
  }

}
