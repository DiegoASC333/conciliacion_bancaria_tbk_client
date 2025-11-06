import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
}
