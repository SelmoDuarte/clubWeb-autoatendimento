import { Component, Input, OnInit } from '@angular/core';
import { Alert } from '../../compra-manual/Funcoes';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Dependente } from '../dependente';
import { DependentesService } from '../dependentes.service';
import { Funcoes, Resposta } from '../../commons/Funcoes';
import { environment } from '../../../environments/environment';
import { ModalAssociadoComponent } from '../../associados/modal-associado/modal-associado.component';

@Component({
  selector: 'app-modal-associado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    HttpClientModule,
],
  templateUrl: './modal-dependente.component.html',
  styleUrl: './modal-dependente.component.css',
  providers: [provideNgxMask(), DependentesService, DecimalPipe ],    	     
})
export class ModalDependenteComponent implements OnInit {

  @Input() public id: string;

  modoLeitura = true;
	processando = true;    
  dependente = new Dependente;
  listaParentesco = [];
  listaCidades = [];
  listaProfissoes = [];
  listaEstadosCivil = [];

  alerts: Alert[] = [];

  
  constructor(
    public activeModal: NgbActiveModal,
    private service: DependentesService,    
    private modalService: NgbModal,    
   ) { }
 
 
  ngOnInit(): void {
      this.processando = true;        
      var filtro  = {'tipo': "DEPENDENTE_ID", 'valor': this.id};

      this.service.getCombosDependente().subscribe( (resp: Resposta) => {

          this.listaParentesco = resp.dados.listaParentesco;
          this.listaCidades = resp.dados.listaCidades;
          this.listaProfissoes = resp.dados.listaProfissoes;
          this.listaEstadosCivil = resp.dados.listaEstadosCivil;          

          this.service.getDependentes(filtro).subscribe((resp1: Resposta) => {
              this.dependente = resp1.dados[0];
              this.processando = false;
    
              this.service.getDependenteDetalhes(this.id).subscribe( (resp2: Resposta) => {
                if (resp.status.codigo == 0){
                    this.dependente.listaAtividades = resp2.dados.listaAtividades;     
                    this.dependente.listaCartoesSocial = resp2.dados.listaCartoesSocial;
                    this.dependente.listaAcessosTemporario = resp2.dados.listaAcessosTemporario;
  
                    this.alerts = [];
                }  
              },(e: any) => { //Error callback
                    this.alerts.push({'type': 'danger', 'message': e.error.status.mensagem});
                    this.processando = false;
              });
          },(e: any) => { //Error callback
                  this.alerts.push({'type': 'danger', 'message': e.error.status.mensagem});
                  this.processando = false;
              });
       },(e: any) => { //Error callback
              this.alerts.push({'type': 'danger', 'message': e.error.status.mensagem});
              this.processando = false;
        });
  }

  getPathFoto(nome_arquivo: string){
      return 'https://minasbrasilia.app.br/fotos/Dependentes/' + nome_arquivo;

  }


	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

  openModalAssociado(){
		this.alerts = [];
		const modal = this.modalService.open(ModalAssociadoComponent, { size: 'xl' });

    modal.componentInstance.id =this.dependente.idassociado;            
    
		modal. result.then(() => { 

		}, () => { 

		})


  }

  salvar(){

  }

  excluir(){

  }

}