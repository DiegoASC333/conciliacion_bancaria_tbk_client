import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReporteVentaService {
  private apiUrl = environment.apiURL;
  constructor(private http: HttpClient) {}

  getReporteVentas(data: any) {
    return this.http.post(`${this.apiUrl}/reporte-ventas`, data);
  }

  exportarExcel(data: any) {
    return this.http.post(`${this.apiUrl}/reporte-ventas-excel`, data, {
      responseType: 'blob',
    });
  }
}
