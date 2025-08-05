import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
})
export class CustomModalComponent {
  @Input() visible: boolean = false;
  @Input() schema: any = {
    title: 'title',
    body: 'body',
  };

  openModal() {
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
  }
}
