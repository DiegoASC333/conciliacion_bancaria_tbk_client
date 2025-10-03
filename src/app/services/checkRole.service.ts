// check-role.service.ts

import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CheckRoleService {
  constructor(private authenticationService: AuthenticationService) {}

  /**
   * Devuelve la ruta de inicio por defecto según el rol del usuario actual.
   */
  getDefaultRoute(): string {
    const currentUser = this.authenticationService.getCurrentUser();

    if (!currentUser) {
      // Si por alguna razón no hay usuario, lo mandamos a login.
      return '/login';
    }

    switch (currentUser.rol) {
      case 'ADMINISTRADOR':
        return '/status-cuadratura'; // Cambié '//' por '/' que es lo estándar
      case 'DAFE':
        return '/status-cuadratura';
      case 'TESORERIA':
        return '/liquidacion/credito';
      case 'CONTABILIDAD':
        return '/cartola-tbk/credito';
      default:
        // Puedes decidir si la ruta por defecto es la raíz o la página de login
        return '/';
    }
  }
}
