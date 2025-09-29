import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RutValidator } from 'ng9-rut';
import { AuthenticationService } from 'src/app/services';

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
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private rutValidator: RutValidator
  ) {
    this.loginForm = this.formBuilder.group({
      rut: ['', [Validators.required, this.rutValidator]],
      password: ['', Validators.required],
    });
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
              case 'DAFE':
                this.router.navigate(['/status-cuadratura']);
                break;
              case 'TESORERIA':
                this.router.navigate(['/liquidaciones']);
                break;
              // Agrega aquí los demás roles de tu sistema
              case 'CONTABILIDAD':
                this.router.navigate(['/contabilidad']);
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
