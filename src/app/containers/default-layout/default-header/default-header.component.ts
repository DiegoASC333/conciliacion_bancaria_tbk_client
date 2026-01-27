import { Component, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular-pro';
import { AuthenticationService, User } from '../../../services/authentication.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = 'sidebar1';

  public logoNegative = '';
  public profilePicture = 'assets/img/avatars/profile.png';

  public themeSwitch = new UntypedFormGroup({
    themeSwitchRadio: new UntypedFormControl('light'),
  });

  user: any;
  usuario: string = '';
  rol: string = '';
  nombre: string = '';
  usuarioActual: User | null = null;
  perfilDelUsuario: string = '';

  constructor(
    private classToggler: ClassToggleService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    super();
    //this.user = this.authenticationService.getCurrentUser();
  }

  ngOnInit() {
    this.usuarioActual = this.authenticationService.getCurrentUser();
    if (this.usuarioActual) {
      this.perfilDelUsuario = this.usuarioActual.perfil;
      this.usuario = this.usuarioActual.rut;
      this.rol = this.usuarioActual.rol;
      this.nombre = this.usuarioActual.nombre;
    }
  }

  setTheme(value: string): void {
    this.themeSwitch.setValue({ themeSwitchRadio: value });
    this.classToggler.toggle('body', 'dark-theme');
  }

  logout() {
    if (this.authenticationService.logout()) {
      this.router.navigate(['/login']);
    }
  }
}
