import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeTranslate',
  pure: false,
})
export class ActiveTranslatePipe implements PipeTransform {
  items = [
    { value: true, name: 'Activo' },
    { value: false, name: 'Inactivo' },
  ];

  transform(bool: boolean) {
    for (const item of this.items) if (item.value === bool) return item.name;
    return bool;
  }
}

@Pipe({
  name: 'roleTranslate',
  pure: false,
})
export class RoleTranslatePipe implements PipeTransform {
  items = [
    { value: 'administrator', name: 'Administrador(a)' },
    { value: 'asistant', name: 'Asistente' },
    { value: 'costCenter', name: 'Encargado(a) de aprobación' },
    { value: 'upperUnit', name: 'Asistente de Unidad Superior' },
    { value: 'student', name: 'Alumno(a)' },
    { value: 'director', name: 'Director(a)' },
    { value: 'Administrador', name: 'Administrador(a)' },
  ];

  transform(str: string) {
    for (const item of this.items) if (item.value === str) return item.name;
    return str;
  }
}

@Pipe({
  name: 'statusTranslate',
  pure: false,
})
export class StatusTranslatePipe implements PipeTransform {
  items = [
    { value: 'REQUIRED', name: 'Solicitada' },
    { value: 'ACCEPTED', name: 'Aceptada' },
    { value: 'REJECTED', name: 'Rechazada' },
    { value: 'WITHDRAWAL', name: 'Desistida' },
    { value: 'FINISHED', name: 'Finalizada' },
  ];

  transform(str: string) {
    for (const item of this.items) if (item.value === str) return item.name;
    return str;
  }
}
