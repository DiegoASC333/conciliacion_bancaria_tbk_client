import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartolaTbkService {
  private apiUrl = environment.apiURL;
  constructor(private http: HttpClient) {}

  getCartola(data: any) {
    return this.http.post(`${this.apiUrl}/cartola-tbk`, data);
  }

  exportarExcel(data: any) {
    return this.http.post(`${this.apiUrl}/cartola-excel`, data, {
      responseType: 'blob',
    });
  }
}
