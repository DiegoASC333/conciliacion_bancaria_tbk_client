import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root', // Forma moderna de proveer el servicio
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authenticationService.getCurrentUser();

    if (user && user.activo === 1) {
      // Si el usuario existe y está activo, permite el acceso
      return true;
    }

    // Para cualquier otro caso (no hay usuario, está inactivo, etc.)
    this.authenticationService.logout(); // Limpiamos cualquier dato inconsistente
    this.router.navigate(['/login']);
    return false;
  }
}
