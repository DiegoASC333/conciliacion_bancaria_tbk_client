import { Component } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { navItems } from './_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  role: any;
  public navItems: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.titleSubscribe();

    /*
    if (this.authenticationService.getRole()) {
      this.role = this.authenticationService.getRole();
      this.navItems = navItems.filter((item: any) => {
        if (item.role) {
          return (item.role === this.role);
        } else {
          return true;
        }
      })[0].menus;

    }
      */
    //this.navItems = navItems[0].menus;

    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      const userRole = currentUser.rol;

      const userNavConfig = navItems.find((item: any) => item.role === userRole);

      if (userNavConfig) {
        this.navItems = userNavConfig.menus;
      } else {
        this.navItems = [];
      }
    }
  }

  public logoNegative = ''; // LOGO COMPLETO
  public sygnet = 'assets/img/brand/logo_utalca_min.png'; // LOGO MIN

  public title!: string;

  //public navItems: any;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  titleSubscribe() {
    this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd && !event.snapshot.firstChild),
        map((value) => {
          const activatedRoute = <ActivatedRoute>(<unknown>value);
          return activatedRoute.snapshot?.data?.['title'] ?? null;
        })
      )
      .subscribe((title: string | null) => {
        this.title = title ?? 'Title';
      });
  }
}
