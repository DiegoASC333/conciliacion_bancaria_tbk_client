import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class StatusCuadraturaService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  private formatDateToAAMMDD(date: Date): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
  }

  getStatusCuadraturaDiaria(fecha: Date, perfilDelUsuario: string) {
    const fechaFormateada = this.formatDateToAAMMDD(fecha);
    console.log('fechaFormateada', fechaFormateada);
    return this.http.get(`${this.apiUrl}/status-cuadratura/${fechaFormateada}/${perfilDelUsuario}`);
  }

  getStatusCuadraturaMensual() {
    return this.http.get(`${this.apiUrl}/status-cuadratura/diaria`);
  }

  getRegistrosTbk(tipo: string, tipoTransaccion: string, fecha: Date, perfilDelUsuario: string) {
    const fechaFormateada = this.formatDateToAAMMDD(fecha);
    return this.http.get(
      `${this.apiUrl}/status-cuadratura/${fechaFormateada}/${tipo}/${tipoTransaccion}/${perfilDelUsuario}`
    );
  }

  reprocesarCupon(cupon: number, id: number) {
    return this.http.post(`${this.apiUrl}/reproceso-cupon`, { cupon, id });
  }

  enviarTesorería(data: any) {
    const fechaFormateada = this.formatDateToAAMMDD(data.fecha);

    const body = {
      usuarioId: data.usuarioId,
      observacion: data.observacion,
      fecha: fechaFormateada,
      totalDiario: data.totalDiario,
    };

    return this.http.post(`${this.apiUrl}/auditoria-dafe`, body);
  }

  exportarExcel(data: any) {
    return this.http.post(`${this.apiUrl}/cuadratura-excel`, data, {
      responseType: 'blob',
    });
  }

  public validarFechasAnteriores(fecha: Date): Observable<any> {
    const fechaFormateada = this.formatDateToAAMMDD(fecha);
    return this.http.get(
      `${this.apiUrl}/cuadratura/validacion/fechas-anteriores/${fechaFormateada}`
    );
  }
}
