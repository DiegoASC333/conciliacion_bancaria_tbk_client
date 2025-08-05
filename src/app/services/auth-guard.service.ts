import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // var user = this.authenticationService.getCurrentUser();
    // if (user === null) {
    //     this.router.navigate(['/login']);
    //     return false;
    // } else if (!user.active) {
    //     this.authenticationService.logout() ? this.router.navigate(['/login']) : null;
    //     return false;
    // }

    return true;
  }
}
