import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class StatusCuadraturaService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getStatusCuadraturaDiaria() {
    return this.http.get(`${this.apiUrl}/status-cuadratura`);
  }

  getStatusCuadraturaMensual() {
    return this.http.get(`${this.apiUrl}/status-cuadratura/diaria`);
  }

  getRegistrosTbk(tipo: string) {
    return this.http.get(`${this.apiUrl}/status-cuadratura/${tipo}`);
  }

  reprocesarCupon(cupon: number) {
    return this.http.post(`${this.apiUrl}/reproceso-cupon`, { cupon });
  }

  enviarTesorería(data: any) {
    return this.http.post(`${this.apiUrl}/auditoria-dafe`, data);
  }
}
