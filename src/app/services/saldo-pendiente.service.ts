import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SaldoPendienteService {
  private apiUrl = environment.apiURL;
  constructor(private http: HttpClient) {}

  getSaldoPendiente(data: any) {
    return this.http.post(`${this.apiUrl}/saldo-pendiente`, data);
  }

  exportarExcel(data: any) {
    return this.http.post(`${this.apiUrl}/saldo-pendiente-excel`, data, {
      responseType: 'blob',
    });
  }
}
