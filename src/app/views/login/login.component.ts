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
  studentForm: FormGroup;
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
    this.studentForm = this.formBuilder.group({
      username: ['', [Validators.required, this.rutValidator]],
    });
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, this.rutValidator]],
      password: ['', Validators.required],
    });
  }

  doLogin(form: any) {
    switch (form) {
      case 0:
        if (this.studentForm.valid) {
          localStorage.setItem('cdp-role', 'student');
          localStorage.setItem('cdp-student', this.studentForm.value.username);
          this.router.navigate(['/inscripcion_practica']);
        }
        break;
      default:
        if (this.loginForm.valid) {
          this.authenticationService.login(this.loginForm.value).subscribe(
            (data: any) => {
              this.authenticationService.saveToken(data.token);
              if (this.authenticationService.getCurrentUser()!.force_password_update) {
                this.router.navigate(['/settings']);
              } else {
                const currentRole = this.authenticationService.getCurrentUser()!.role;
                switch (currentRole) {
                  case 'Administrador':
                    this.router.navigate(['/usuarios']);
                    break;
                  case 'Revisor(a)':
                    this.router.navigate(['/historial']);
                    break;
                  case 'Asistente':
                    this.router.navigate(['/ingresar/ayudantia-academica']);
                    break;
                  case 'Encargado(a) de aprobación':
                    this.router.navigate(['/presupuesto']);
                    break;
                  case 'Asistente unidad superior':
                    this.router.navigate(['/documentos-pendiente-firma']);
                    break;
                  case 'Decano(a)':
                    this.router.navigate(['/documentos-pendiente-firma']);
                    break;
                  case 'Secretario(a) de Facultad':
                    this.router.navigate(['/documentos-pendiente-firma']);
                    break;
                }
              }
            },
            (error: any) => {
              this.formError = true;
              this.errorMessage =
                'Ocurrió un error al acceder. Revise que los datos sean correctos e intente nuevamente.' +
                '\nDetalles del error: ' +
                error.message;
            }
          );
        }
        break;
    }
  }

  showLogin(option: any) {
    switch (option) {
      case 0:
        this.studentVisible = !this.studentVisible;
        break;
      case 1:
        this.companyVisible = !this.companyVisible;
        break;
      case 2:
        this.administratorVisible = !this.administratorVisible;
        break;
      default:
        break;
    }
  }
}
