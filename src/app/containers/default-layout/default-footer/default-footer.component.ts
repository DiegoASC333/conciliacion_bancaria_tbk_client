import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular-pro';

@Component({
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss'],
})
export class DefaultFooterComponent extends FooterComponent {
  //obtener año en el componente
  currentYear: number;

  constructor() {
    super();
    this.currentYear = new Date().getFullYear();
  }
}
