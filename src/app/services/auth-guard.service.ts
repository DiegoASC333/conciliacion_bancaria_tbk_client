import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root', // Forma moderna de proveer el servicio
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.authenticationService.getCurrentUser();
    if (user === null) {
      this.router.navigate(['/login']);
      return false;
    } else if (!user.activo) {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
