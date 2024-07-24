import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Alert, Filtro, Funcoes, PERFIS_MANUTENCAO, PERFIS_TABELAS, Resposta } from '../../../commons/Funcoes';
import { ModalAcessoNegadoComponent } from '../../../auth/modal-acessoNegado/modal-acessoNegado.component';
import { TabelaCobrancaService } from '../cobranca.service';
import { Cobranca } from '../cobranca';


@Component({
  selector: 'app-modal-cobranca',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    HttpClientModule,
],
  templateUrl: './modal-cobranca.component.html',
  styleUrl: './modal-cobranca.component.css',
  providers: [provideNgxMask(), TabelaCobrancaService, DecimalPipe ],    	     
})

export class ModalTabelaCobrancaComponent implements OnInit {

  @Input() public id: string;

	@ViewChild("campoInicial") campoInicial : ElementRef;  
  @ViewChild("checkBox_flg_ativo") checkBox_flg_ativo : ElementRef;  

  modoLeitura = true;
	processando = true;    
  cobranca = new Cobranca;
  perfil = [PERFIS_TABELAS, PERFIS_MANUTENCAO];

  alerts: Alert[] = [];

  
  constructor(
    public activeModal: NgbActiveModal,
    private service: TabelaCobrancaService,    
    private modalService: NgbModal,
   ) { }
 
 
  ngOnInit(): void {
    this.processando = true;        

    if (this.id == null){
      this.modoLeitura = false;                        
      this.cobranca = new Cobranca;
      this.processando = false;


      if (! Funcoes.verificaAcesso(this.perfil)){
        var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
        modalRef.componentInstance.papel = this.perfil;
        setTimeout(() => this.activeModal.close(), 10);      
        return;
      }

      setTimeout(() => this.campoInicial.nativeElement.focus(), 0);
     }else{
        this.service.get(this.id).subscribe((resp: Resposta) => {
          this.cobranca = resp.dados;
          this.processando = false;
        });      
     }
  }


	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}


  editar(){

    if (! Funcoes.verificaAcesso(this.perfil)){
      var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
      modalRef.componentInstance.papel = this.perfil;
      setTimeout(() => this.activeModal.close(), 10);      
      return;

    }


    this.modoLeitura = false;
  }

  salvar(){

      if (this.cobranca.DESCR == null ) {
        this.alerts = Array.from([{
            type: "danger",
            message: "ATENÇÃO, nome inválido !!!",
        }]);
        var c: any = document.getElementById('nome');
        c.focus();
        return;
      }

      this.service.salvar(this.cobranca, this.cobranca.IDCOBRANCA ).subscribe(
        (resp: Resposta) => {
          this.processando = false;
          this.cobranca = resp.dados;
          const alert =  new Alert;
          alert.type = 'success';
          alert.message = 'Registro salvo com sucesso !!!';
          this.alerts = [];
          this.alerts.push(alert);
        },
        (e: any) => { 
          this.alerts = [];
          console.error(e.error.status.mensagem);
          const alert =  new Alert;
          alert.type = 'danger';
          alert.message = e.error.status.mensagem;

          this.alerts.push(alert);
      
          this.processando = false;
        }
        );

  }

  excluir(){
		if (! confirm("Deseja realmente excluir este registro ?" ) == true) {
			return;
		}		

    this.service.excluir(this.cobranca.IDCOBRANCA).subscribe(
      (resp: Resposta) => {
        this.processando = false;
        this.cobranca = resp.dados;
        const alert =  new Alert;
        alert.type = 'success';
        alert.message = 'Registro excluido com sucesso !!!';
        this.alerts = [];
        this.alerts.push(alert);
        setTimeout(() => this.activeModal.close(), 10);
      },
      (e: any) => { 
        this.alerts = [];
        console.error(e.error.status.mensagem);
        const alert =  new Alert;
        alert.type = 'danger';
        alert.message = e.error.status.mensagem;

        this.alerts.push(alert);
    
        this.processando = false;
      }
      );
  }

}