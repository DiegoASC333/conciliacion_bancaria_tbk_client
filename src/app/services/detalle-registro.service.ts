import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DetalleRegistroService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getDataHistorial(data: any) {
    return this.http.post(`${this.apiUrl}/historial-rut`, data);
  }
}
