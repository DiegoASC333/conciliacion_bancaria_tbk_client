import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { environment } from '../../environments/environment';

export interface User {
  rut: number;
  rol: string;
  perfil: string;
  activo: number;
}

@Injectable({
  providedIn: 'root', // Forma moderna de proveer el servicio
})
export class AuthenticationService {
  baseURL: string = environment.apiURL;

  constructor(private httpClient: HttpClient) {}

  logout(): boolean {
    localStorage.removeItem('cdp-token');
    localStorage.removeItem('cdp-user');
    return true;
  }

  isLogged(): boolean {
    const token = this.getToken();

    if (!token || token === 'undefined') {
      return false;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload.exp! > Date.now() / 1000;
    } catch (error) {
      console.error('Token inválido detectado. Previniendo error y retornando false.', error);
      return false; // ¡ESTE RETURN ES LA CLAVE!
    }
  }

  login(credentials: any) {
    return this.httpClient.post(`${this.baseURL}/login`, credentials);
  }

  getCurrentUser(): User | null {
    const userString = localStorage.getItem('cdp-user');
    if (this.isLogged() && userString) {
      try {
        return JSON.parse(userString) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  saveLoginData(data: { token: string; usuario: User }): void {
    localStorage.setItem('cdp-token', data.token);
    localStorage.setItem('cdp-user', JSON.stringify(data.usuario));
  }

  getToken(): string | null {
    return localStorage.getItem('cdp-token');
  }
}
