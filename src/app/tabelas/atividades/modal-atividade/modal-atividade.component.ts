import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AtividadeService } from '../atividades.service';
import { Atividade } from '../atividade';
import { Alert, Filtro, Funcoes, Resposta } from '../../../commons/Funcoes';
import { ModalAcessoNegadoComponent } from '../../../auth/modal-acessoNegado/modal-acessoNegado.component';
import { ModalTurmaComponent } from '../../turmas/modal-turma/modal-turma.component';

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
  templateUrl: './modal-atividade.component.html',
  styleUrl: './modal-atividade.component.css',
  providers: [provideNgxMask(), AtividadeService, DecimalPipe ],    	     
})
export class ModalAtividadeComponent implements OnInit {

  @Input() public id: string;
  @ViewChild("campoInicial") campoInicial : ElementRef;  
  @ViewChild("checkBox_estado") checkBox_estado : ElementRef;  

  modoLeitura = true;
	processando = true;    
  atividade = new Atividade;
  listaEstado = [{'id': 'A', 'descricao' : 'Ativo'}, {'id': 'C', 'descricao' : 'Cancelado'}];
  listaProfessores = [];
  perfil = ["TABELAS-MANUTENCAO"];  
  
  
  alerts: Alert[] = [];

  
  constructor(
    public activeModal: NgbActiveModal,
    private service: AtividadeService,    
    private modalService: NgbModal,    
   ) { }
 
 
  ngOnInit(): void {
    this.processando = true;        

    this.service.getCombos().subscribe((resp1: Resposta) => {
        this.listaProfessores = resp1.dados.listaProfessores;

        if (this.id == null){
          this.modoLeitura = false;                        
          this.atividade = new Atividade;
          this.processando = false;

          if (! Funcoes.verificaAcesso(this.perfil)){
            var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
            modalRef.componentInstance.papel = this.perfil;
            setTimeout(() => this.activeModal.close(), 10);      
            return;
          }
    
          setTimeout(() => this.campoInicial.nativeElement.focus(), 0);
        }else{

          var filtro  = new Filtro;
          filtro.tipo =  "ID";
          filtro.valor = this.id;

          this.service.get(filtro).subscribe((resp: Resposta) => {
            this.atividade = resp.dados;
            this.service.getDetalhes(this.id).subscribe((resp: Resposta) => {
              this.atividade.listaTurmas = resp.dados.listaTurmas;
              this.processando = false;
            });      
  
          });      


        }
    },(e: any) => { //Error callback
      var msg = "";
      if (e.error.status.mensagem == undefined){
        msg = e.message;
      }else{
        msg = e.error.status.mensagem;
      }

      this.alerts.push({'type': 'danger', 'message': msg});
      this.processando = false;
    });
}

	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

  getNomeProfessor(id: string){
    return Funcoes.getElementoCombo(id,this.listaProfessores).nome;
  }

	openModalTurma(id: string) {

		this.alerts = [];
		const modal = this.modalService.open(ModalTurmaComponent, { size: 'lg' });

    modal.componentInstance.id =id;            
    modal.componentInstance.idatividade = this.atividade.idatividade;
    
		modal. result.then(() => { 
      this.service.getDetalhes(this.id).subscribe((resp: Resposta) => {
        this.atividade.listaTurmas = resp.dados.listaTurmas;
        this.processando = false;
      });        
		}, () => { 
      this.service.getDetalhes(this.id).subscribe((resp: Resposta) => {
        this.atividade.listaTurmas = resp.dados.listaTurmas;
        this.processando = false;
      });        
		})
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

      if (this.atividade.nome == null ) {
        this.alerts = Array.from([{
            type: "danger",
            message: "ATENÇÃO, nome inválido !!!",
        }]);
        var c: any = document.getElementById('nome');
        c.focus();
        return;
      }

      if (this.checkBox_estado.nativeElement.checked){
        this.atividade.estado = 'A';
      }else{
        this.atividade.estado = null;        
      }


      this.service.salvar(this.atividade).subscribe(
        (resp: Resposta) => {
          this.processando = false;
          this.atividade = resp.dados;
          const alert =  new Alert;
          alert.type = 'success';
          alert.message = 'Registro salvo com sucesso !!!';
          this.alerts = [];
          this.alerts.push(alert);
          setTimeout(() => this.alerts = [], 1000);
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

    this.service.excluir(this.atividade).subscribe(
      (resp: Resposta) => {
        this.processando = false;
        this.atividade = resp.dados;
        const alert =  new Alert;
        alert.type = 'success';
        alert.message = 'Registro excluido com sucesso !!!';
        this.alerts = [];
        this.alerts.push(alert);
        setTimeout(() => this.activeModal.close(), 1000);        
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