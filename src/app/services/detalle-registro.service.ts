import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';

export interface HistorialItem {
  cupon_Credito: number;
  rut: string;
  fecha_venta: string;
  fecha_abono: string;
  cuota_pagada: number;
  TOTAL_CUOTAS: number;
  monto: number;
  nombre: string;
  cuotas_restantes: number;
  deuda_pagada: number;
  deuda_por_pagar: number;
}

@Injectable({
  providedIn: 'root',
})
export class DetalleRegistroService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getDataHistorial(data: any) {
    return this.http.post(`${this.apiUrl}/historial-rut`, data);
  }

  getDataHistorialMock(data: { rut: string; tipo: string }): Observable<HistorialItem[]> {
    // Datos de prueba
    const datos: HistorialItem[] = [
      {
        cupon_Credito: 743309,
        rut: data.rut,
        fecha_venta: '14052025',
        fecha_abono: '16052025',
        cuota_pagada: 1,
        TOTAL_CUOTAS: 5,
        monto: 30205,
        nombre: 'Juan Pérez',
        cuotas_restantes: 4,
        deuda_pagada: 30205,
        deuda_por_pagar: 151025,
      },
      {
        cupon_Credito: 743310,
        rut: data.rut,
        fecha_venta: '15052025',
        fecha_abono: '17052025',
        cuota_pagada: 2,
        TOTAL_CUOTAS: 5,
        monto: 50000,
        nombre: 'Juan Pérez',
        cuotas_restantes: 3,
        deuda_pagada: 25000,
        deuda_por_pagar: 75000,
      },
    ];

    return of(datos); // Observable que emite el array
  }
}
