import { Component, Input, OnInit } from '@angular/core';
import { Alert } from '../../compra-manual/Funcoes';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Resposta } from '../../commons/Funcoes';
import { NaoSocioService } from '../nao-socio.service';
import { NaoSocio } from '../nao-socio';

@Component({
  selector: 'app-modal-nao-socio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    HttpClientModule,
],
  templateUrl: './modal-nao-socio.component.html',
  styleUrl: './modal-nao-socio.component.css',
  providers: [provideNgxMask(), NaoSocioService, DecimalPipe ],    	     
})
export class ModalNaoSocioComponent implements OnInit {

  @Input() public id: string;

  modoLeitura = true;
	processando = false;    
  naoSocio = new NaoSocio;
  listaParentesco = [];
  listaCidades = [];
  listaProfissoes = [];
  listaEstadosCivil = [];

  alerts: Alert[] = [];
  
  constructor(
    public activeModal: NgbActiveModal,
    private service: NaoSocioService,    
   ) { }
 
 
  ngOnInit(): void {

      var filtro  = {'tipo': "NAO_SOCIO_ID", 'valor': this.id};

      this.service.getCombosNaoSocio().subscribe(
        (resp: Resposta) => {
          this.processando = false;
          this.listaParentesco = resp.dados.listaParentesco;
          this.listaCidades = resp.dados.listaCidades;
          this.listaProfissoes = resp.dados.listaProfissoes;
          this.listaEstadosCivil = resp.dados.listaEstadosCivil;          

          this.service.getNaoSocio(filtro).subscribe(
            (resp: Resposta) => {
              this.processando = false;
              this.naoSocio = resp.dados[0];
    
              this.alerts = [];
           }
            );
            
       }
        );
  }

	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

  salvar(){

  }

  excluir(){

  }

}