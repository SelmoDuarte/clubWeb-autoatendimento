import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DecimalPipe, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ModalMensagemComponent } from '../../commons/modal-mensagem/modal-mensagem.component';
import { AuthService } from '../../auth/auth.services';

@Component({
  selector: 'app-modal-carteira-vencimento',
  standalone: true,  
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
  ],

  templateUrl: './modal-utilitarios.component.html',
  styleUrls: ['./modal-utilitarios.component.css'],
  providers: [provideNgxMask(), DecimalPipe]  
})

export class ModalUtilitariosComponent implements OnInit {
  
  @ViewChild("campoInicial") campoInicial : ElementRef;    


  processando = false;

  listaCategoria = [{id:"19", descricao:"01 Ano"}, {id:"613", descricao:"02 Anos"} , {id:"614", descricao:"03 Anos"}];

  constructor(  public activeModal: NgbActiveModal,     private authService: AuthService,  private modalService: NgbModal,) { }
  
  
  ngOnInit(): void {
  
  }


  limparCache(){
      localStorage.removeItem('comboASSOCIADO');
      localStorage.removeItem('comboDEPENDENTE');
      localStorage.removeItem('comboCONCESSIONARIO');
      localStorage.removeItem('comboCONCESSIONARIO-COLABORADOR');
      localStorage.removeItem('comboEMBARCACOES');
      localStorage.removeItem('comboESPORTE');
      localStorage.removeItem('comboFINANCEIRO');
      localStorage.removeItem('comboFUNCONARIO');
      localStorage.removeItem('comboNAO_SOCIO');
      localStorage.removeItem('comboFUNCIONARIO');
      var modalSucesso = this.modalService.open(ModalMensagemComponent);
      modalSucesso.componentInstance.alerts = Array.from([{ type: "success", message: "<b>Cache renovado com sucesso !!!",  }]);
      setTimeout(() => modalSucesso.close(), 2000);        
      this.activeModal.close();
  }

  refreshToken(){

    this.processando = true;
    this.authService.refreshToken().subscribe((resp: any) => {
      this.processando = false;
      console.log('Refresh TOKEN');
      localStorage.setItem("usuario", JSON.stringify(resp.dados));
      this.activeModal.close('REVALIDOU_TOKEN');

      var modalSucesso = this.modalService.open(ModalMensagemComponent);
      modalSucesso.componentInstance.alerts = Array.from([{ type: "success", message: "<b>Token revalidado com sucesso !!!",  }]);
      setTimeout(() => modalSucesso.close(), 2000);        
      this.activeModal.close();      


    });

  }

  logout() {
    this.authService.logout();
    this.activeModal.close();
  }

  cancelar(){
    this.activeModal.close();    
  }

}
