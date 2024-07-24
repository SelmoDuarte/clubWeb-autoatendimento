import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Alert, Filtro, Funcoes, Resposta } from '../../../commons/Funcoes';
import { ModalAcessoNegadoComponent } from '../../../auth/modal-acessoNegado/modal-acessoNegado.component';
import { TurmaService } from '../turmas.service';
import { Turma } from '../turma';
import { TabelaListaProfessoresComponent } from '../../professores/professores.component';
import { ModalProfessorSelecionarComponent } from '../../professores/modal-professor-selecionar/modal-professor-selecionar.component';
import { ModalProfessorComponent } from '../../professores/modal-professor/modal-professor.component';
import { Professor } from '../../professores/professor';

@Component({
  selector: 'app-modal-turma',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    HttpClientModule,
],
  templateUrl: './modal-turma.component.html',
  styleUrl: './modal-turma.component.css',
  providers: [provideNgxMask(), TurmaService, DecimalPipe ],    	     
})
export class ModalTurmaComponent implements OnInit {

  @Input() public id: string;
  @Input() public idatividade: string;
  @ViewChild("campoInicial") campoInicial : ElementRef;  
  @ViewChild("checkBox_estado") checkBox_estado : ElementRef;  
  @ViewChild("checkBox_flg_fim_indef") checkBox_flg_fim_indef : ElementRef;  
  
  modoLeitura = true;
	processando = true;    
  turma = new Turma;
  
  
  alerts: Alert[] = [];

  listaCobranca = [{id:'V', descricao: 'Valor Total do Curso'}, {id:'M', descricao: 'Mensalidade'}];
  listaAtividades = [];
  listaTipoCobranca = [];
  listaCategorias = [];
  perfil = ["TABELAS-MANUTENCAO"];
  
  constructor(
    public activeModal: NgbActiveModal,
    private service: TurmaService,    
    private modalService: NgbModal,    
   ) { }
 
 
  ngOnInit(): void {
    this.processando = true;        

    this.service.getCombos().subscribe((resp: Resposta) => {

        this.listaAtividades  = resp.dados.listaAtividades;
        this.listaTipoCobranca  = resp.dados.listaTipoCobranca;
        this.listaCategorias  = resp.dados.listaCategorias;
      

        if (this.id == null){
          this.modoLeitura = false;                        
          this.turma = new Turma;
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
              this.turma = resp.dados;
              var categoria = resp.dados.idcategoria;
              this.service.getCategorias(this.turma.idcobranca).subscribe((resp: Resposta)  => {
                this.listaCategorias = resp.dados;
                this.turma.idcategoria = categoria;
                this.service.getDetalhes(this.id).subscribe((resp: Resposta) => {
                  this.turma.listaProfessores = resp.dados.listaProfessores;
                  this.processando = false;
                });      
              });			
              this.processando = false;
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

	atualizarListaCategorias(){
		this.service.getCategorias(this.turma.idcobranca).subscribe((resp: Resposta)  => {
			this.listaCategorias = resp.dados;
		});
	}

  verificaFimTurma(){
    if (this.checkBox_flg_fim_indef.nativeElement.checked){
      this.turma.flg_fim_indef = 'S';
      this.turma.dt_fim = null;
    }else{
      this.turma.flg_fim_indef = null;        
    }

  }

  verificaProfessorPrincipal(id: string){
    if (id == this.turma.idprofessor){
      return "(Professor Principal)";
    }else{
      return null;
    }
  }

  incluirProfessor(p: Professor){

    this.service.professorIncluir(this.turma, p).subscribe(
      (resp: Resposta) => {
        this.turma.listaProfessores = resp.dados.listaProfessores;
        this.processando = false;
        const alert =  new Alert;
        alert.type = 'success';
        alert.message = 'Professor incluido com sucesso !!!';
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


  excluirProfessor(p: Professor){

		if (! confirm("Deseja realmente remover este Professor ?" ) == true) {
			return;
		}		

    this.service.professorExcluir(this.turma, p).subscribe(
      (resp: Resposta) => {
        this.turma.listaProfessores = resp.dados.listaProfessores;        
        this.processando = false;
        const alert =  new Alert;
        alert.type = 'success';
        alert.message = 'Professor excluido com sucesso !!!';
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

  definirProfessorPrincipal(p: Professor){

		if (! confirm("Deseja definir este Professor como o Principal ?" ) == true) {
			return;
		}		

    this.service.professorDefinirPrincipal(this.turma, p).subscribe(
      (resp: Resposta) => {
        this.turma.idprofessor = p.id;
        this.processando = false;
        const alert =  new Alert;
        alert.type = 'success';
        alert.message = 'Professor definido como Principal !!!';
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


  openModalProfessores() {

		this.alerts = [];
		const modal = this.modalService.open(ModalProfessorComponent, { size: 'lg' });

    modal.componentInstance.id = '1';            
    
		modal. result.then(() => { 
		}, () => { 
		})
	}	

  openModalSelecionarProfessores() {

		this.alerts = [];
		const modal = this.modalService.open(ModalProfessorSelecionarComponent, { size: 'lg' });

    modal.componentInstance.id = '1';            
    
		modal. result.then((data: Professor) => { 

      if (data !== null){
        this.incluirProfessor(data);
      }
		}, () => { 
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

      if (this.turma.nome == null ) {
        this.alerts = Array.from([{
            type: "danger",
            message: "ATENÇÃO, nome inválido !!!",
        }]);
        var c: any = document.getElementById('nome');
        c.focus();
        return;
      }

      if (this.checkBox_estado.nativeElement.checked){
        this.turma.estado = 'A';
      }else{
        this.turma.estado = null;        
      }

      this.turma.idatividade = this.idatividade;

      this.service.salvar(this.turma).subscribe(
        (resp: Resposta) => {
          this.processando = false;
          this.turma = resp.dados;
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

    this.service.excluir(this.turma).subscribe(
      (resp: Resposta) => {
        this.processando = false;
        this.turma = resp.dados;
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