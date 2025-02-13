import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DecimalPipe  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { AuthService } from '../auth/auth.services';


@Component({
  selector: 'app-modal-carteira-vencimento',
  standalone: true,  
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
  ],

  templateUrl: './modal-token-timer.component.html',
  styleUrls: ['./modal-token-timer.component.css'],
  providers: [provideNgxMask(), DecimalPipe]  
})

export class ModalTokenTimerComponent implements OnInit {

    @ViewChild("progressbar") progressbar! : ElementRef;

    countInicial: number = 60
    countdown: number  = this.countInicial;
    countup: number  = 0;
    interval: any;
    logoff = true;
    processando = false;


    constructor(
      private authService: AuthService,
      public activeModal: NgbActiveModal
    ) { }
  

    ngOnInit() {
      this.startCountdown();
    }

    startCountdown() {
      this.interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
          this.countup++;
        } else {
          this.endSession();
        }
      }, 1000);
    }

    revalidateToken() {
      this.processando = true;
      this.authService.refreshToken().subscribe((resp: any) => {
        this.processando = false;
        console.log('Refresh TOKEN');
        localStorage.setItem("usuario", JSON.stringify(resp.dados));
        this.activeModal.close('REVALIDOU_TOKEN');
        this.logoff = false;
      });

    }

    endSession() {
      if (this.logoff){
        console.log('LOGOFF Realizado Automáticamente');
        this.authService.logout();
        this.activeModal.close();
        this.logoff = false;
        this.activeModal.close('');
      }
    }

}
