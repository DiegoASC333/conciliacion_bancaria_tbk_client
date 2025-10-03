import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RutValidator } from 'ng9-rut';
import { AuthenticationService } from '../../services/authentication.service';
import { SSOService } from '../../services/ssoservice.service';
import { CheckRoleService } from '../../services/checkRole.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  // studentForm: FormGroup;
  loginForm: FormGroup;
  formError = false;
  errorMessage = '';
  administratorVisible = true;
  studentVisible = false;
  companyVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ssoService: SSOService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private rutValidator: RutValidator,
    private checkRole: CheckRoleService
  ) {
    this.loginForm = this.formBuilder.group({
      rut: ['', [Validators.required, this.rutValidator]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params) => {
        if (params['id']) {
          try {
            sessionStorage.setItem('id', params['id']);
            sessionStorage.setItem('sso', 'true');
            sessionStorage.setItem('date', Date.now().toString());
          } catch (error) {
            console.log('sessionStorage error', error);
          }
        }
      },
      (error) => {
        console.log('Error', error);
      }
    );
    try {
      if (this.checkSSOExpiration()) {
        sessionStorage.clear();
        this.ssoService.login();
      } else if (sessionStorage.getItem('sso')) {
        const id = sessionStorage.getItem('id') ?? '';
        console.log('id antes de entrar al back', id);
        this.authenticationService.loginBack(id).subscribe({
          next: (response: any) => {
            this.authenticationService.saveLoginData(response);
          },
          error: (err) => {
            console.log(err);
            //this.showMessage = true;
          },
          complete: () => {
            console.log('Entraste');
            this.router.navigate([this.checkRole.getDefaultRoute()]);
          },
        });
      } else {
        this.ssoService.login();
      }
    } catch (error) {
      console.log('Error un SSO process', error);
    }
  }

  checkSSOExpiration() {
    const storedDate = sessionStorage.getItem('date');
    if (storedDate !== null) {
      const timeDifference = Date.now() - parseInt(storedDate);
      const millisecondsInSecond = 1000;
      const millisecondsInMinute = 60 * millisecondsInSecond;
      const millisecondsInHour = 60 * millisecondsInMinute;
      const millisecondsInDay = 24 * millisecondsInHour;
      const minutes = Math.floor((timeDifference % millisecondsInHour) / millisecondsInMinute);
      return minutes > 25 ? true : false;
    }
    return false;
  }

  doLogin() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value).subscribe({
        next: (data: any) => {
          this.authenticationService.saveLoginData(data);

          const currentUser = this.authenticationService.getCurrentUser();

          if (currentUser) {
            const currentRole = currentUser.rol;
            console.log('Redirigiendo por rol:', currentRole);

            switch (currentRole) {
              case 'ADMINISTRADOR':
                this.router.navigate(['//status-cuadratura']);
                break;
              case 'DAFE':
                this.router.navigate(['/status-cuadratura']);
                break;
              case 'TESORERIA':
                this.router.navigate(['/liquidacion/credito']);
                break;
              // Agrega aquí los demás roles de tu sistema
              case 'CONTABILIDAD':
                this.router.navigate(['/cartola-tbk/credito']);
                break;
              default:
                this.router.navigate(['/']); // Una ruta por defecto
                break;
            }
          } else {
            this.formError = true;
            this.errorMessage = 'No se pudo obtener la información del usuario tras el login.';
          }
        },
        error: (error: any) => {
          this.formError = true;
          this.errorMessage = error.error?.message || 'Error de conexión. Intente nuevamente.';
        },
      });
    }
  }
}
