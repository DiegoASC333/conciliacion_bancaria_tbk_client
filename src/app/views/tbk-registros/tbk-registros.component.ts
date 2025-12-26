import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StatusCuadraturaService } from '../../services/status-cuadratura.service';

@Component({
  selector: 'app-tbk-registros',
  templateUrl: './tbk-registros.component.html',
  styleUrls: ['./tbk-registros.component.scss'],
})
export class TbkRegistrosComponent {
  title = 'Registros TBK';
  @Input() visible: boolean = false;
  //@Input() viewModalRegistros: boolean = false;
  @Input() registrosTbk: any[] = [];
  @Input() columns: any[] = [];
  @Input() items: any[] = [];
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  // tbk-registros.component.ts
  @Output() reprocesar = new EventEmitter<any>();

  constructor(private statusCuadraturaService: StatusCuadraturaService) {}

  onTablaAction(evt: { action: string; item: any }) {
    if (evt?.action === 'reprocesar') {
      this.reprocesar.emit(evt.item);
    }
  }

  close() {
    this.closeModal.emit();
  }
}
