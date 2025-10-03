import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SSOService {
  private id: any;
  private v: any;

  constructor(private route: ActivatedRoute) {}

  login() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'] || false;
      this.v = params['v'] || false;
    });
    if (!this.id) {
      const url = encodeURIComponent(window.location.href);
      window.location.href = `https://huemul.utalca.cl/sso/login.php?url=${url}`;
    }
  }
}
