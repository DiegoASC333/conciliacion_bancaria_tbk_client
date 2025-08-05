import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IColumn, IItem } from '@coreui/angular-pro';
import { RutValidator } from 'ng9-rut';
import { cilArrowRight, cilX } from '@coreui/icons';

export interface Breadcrumb {
  label: string;
  url?: string;
  active?: boolean;
}

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent {
  @Input() title: string = '';
  @Input() columns: (IColumn | string)[] = [];
  @Input() items: IItem[] = [];
  @Input() filterOptions: any = {}; //TODO: Revisar tipo de objetosprivate rutValidator: RutValidator,
  @Input() button: any = {
    isVisible: false,
    label: '',
  };
  @Input() loading: boolean = true;
  @Input() breadcrumbs: Breadcrumb[] = [];

  constructor(private rutValidator: RutValidator) {}

  icons = { cilArrowRight, cilX };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items.length > 0 && this.columns.length === 0) {
      this.columns = this.generateColumnsFromItems(this.items);
    }
  }

  //Método para obtener las columnas desde cualquier endpoint
  generateColumnsFromItems(items: any[]): { key: string; label: string }[] {
    if (!items || items.length === 0) return [];

    return Object.keys(items[0]).map((key) => ({
      key,
      label: this.formatKeyToLabel(key),
    }));
  }

  //Método para crear los Label de la tabla con mayusculas y espacios
  formatKeyToLabel(key: string): string {
    // Ejemplo: "id_rol" → "Id Rol"
    return key
      .replace(/_/g, ' ') // reemplaza guiones bajos con espacios
      .replace(
        /\w\S*/g,
        (
          txt // pone mayúscula a cada palabra
        ) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  }

  isStringType(tdContent: any): boolean {
    return typeof tdContent === 'string';
  }

  isNumberType(tdContent: any): boolean {
    return typeof tdContent === 'number';
  }

  isEmpty(tdContent: any): boolean {
    return (
      (typeof tdContent === 'string' && tdContent.trim().length === 0) ||
      tdContent === undefined ||
      tdContent === null
    );
  }
}
