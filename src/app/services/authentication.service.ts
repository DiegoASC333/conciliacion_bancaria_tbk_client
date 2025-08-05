import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
  baseURL: string = environment.apiURL;

  constructor(private httpClient: HttpClient) {}

  logout(): boolean {
    localStorage.removeItem('cdp-token');
    localStorage.removeItem('cdp-role');
    localStorage.removeItem('cdp-student');
    return true;
  }

  isLogged(): boolean {
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token).exp! > Date.now() / 1000 : false;
  }

  login(credentials: any) {
    return this.httpClient.post(this.baseURL + '/login', credentials);
  }

  getCurrentUser() {
    if (this.isLogged()) {
      const token = this.getToken();
      const payload: any = jwtDecode(token);
      localStorage.setItem('cdp-role', payload.role);
      return {
        id: payload._id,
        email: payload.email,
        name: payload.name,
        lastname: payload.lastname,
        role: payload.role,
        program: payload.program ? payload.program : null,
        active: payload.active,
        rut: payload.rut,
        force_password_update: payload.force_password_update,
      };
    } else {
      return null;
    }
  }

  saveToken(token: string) {
    localStorage.setItem('cdp-token', token);
  }

  getToken(): any {
    return localStorage.getItem('cdp-token');
  }

  getRole(): any {
    return localStorage.getItem('cdp-role');
  }

  getStudentRun(): any {
    return localStorage.getItem('cdp-student');
  }
}
