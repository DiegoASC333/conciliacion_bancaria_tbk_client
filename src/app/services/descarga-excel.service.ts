import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DescargaExcelService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getDataDescargaExcel(data: any) {
    return this.http.post(`${this.apiUrl}/descargar-excel`, data);
  }

  descargarExcelPorDia(data: any) {
    return this.http.post(`${this.apiUrl}/descargar-excel-dia`, data, { responseType: 'blob' });
  }
}
