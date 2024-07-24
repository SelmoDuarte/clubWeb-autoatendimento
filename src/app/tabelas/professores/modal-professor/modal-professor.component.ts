import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Alert, Filtro, Funcoes, Resposta } from '../../../commons/Funcoes';
import { ProfessoresService } from '../professores.service';
import { Professor } from '../professor';
import { ModalAcessoNegadoComponent } from '../../../auth/modal-acessoNegado/modal-acessoNegado.component';

@Component({
  selector: 'app-modal-professor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    HttpClientModule,
],
  templateUrl: './modal-professor.component.html',
  styleUrl: './modal-professor.component.css',
  providers: [provideNgxMask(), ProfessoresService, DecimalPipe ],    	     
})

export class ModalProfessorComponent implements OnInit {

  @Input() public id: string;

	@ViewChild("campoInicial") campoInicial : ElementRef;  
  @ViewChild("checkBox_flg_ativo") checkBox_flg_ativo : ElementRef;  

  modoLeitura = true;
	processando = true;    
  professor = new Professor;
  listaEstado = [{'id': 'A', 'descricao' : 'Ativo'}, {'id': 'C', 'descricao' : 'Cancelado'}];
  listaProfessores = [];
  listaCidades = [];
  perfil = ["TABELAS-MANUTENCAO"];

  alerts: Alert[] = [];

  
  constructor(
    public activeModal: NgbActiveModal,
    private service: ProfessoresService,    
    private modalService: NgbModal,
   ) { }
 
 
  ngOnInit(): void {
      this.processando = true;        

      this.service.getCombos().subscribe((resp1: Resposta) => {
          this.listaCidades = resp1.dados.listaCidades;

          if (this.id == null){
            this.modoLeitura = false;                        
            this.professor = new Professor;
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

            this.service.get(filtro).subscribe((resp1: Resposta) => {
              this.professor = resp1.dados;
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

  getNomeProfessor(id: string){
    return Funcoes.getElementoCombo(id,this.listaProfessores).nome;
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

      if (this.professor.cpf == null || !Funcoes.isValidCPF(this.professor.cpf  )) {
            this.alerts = Array.from([{
                type: "danger",
                message: "ATENÇÃO, CPF inválido !!!",
            }]);
            var c: any = document.getElementById('campoInicial');
            c.focus();
            return;
      }

      if (this.professor.nome == null ) {
        this.alerts = Array.from([{
            type: "danger",
            message: "ATENÇÃO, nome inválido !!!",
        }]);
        var c: any = document.getElementById('nome');
        c.focus();
        return;
      }

      if (this.professor.dtnasc !== null && this.professor.dtnasc !== '' && !Funcoes.validarData(this.professor.dtnasc )) {
        this.alerts = Array.from([{
            type: "danger",
            message: "ATENÇÃO, Data inválida !!!",
        }]);
        var c: any = document.getElementById('campoInicial');
        c.focus();
        return;
  }


      if (this.professor.email !== null && !Funcoes.validarEmail(this.professor.email)) {
          this.alerts = Array.from([{
              type: "danger",
              message: "ATENÇÃO, email inválido !!!",
          }]);
          var c: any = document.getElementById('email');
          c.focus();
          return;
      }

      if (this.checkBox_flg_ativo.nativeElement.checked){
        this.professor.flg_ativo = 'S';
      }else{
        this.professor.flg_ativo = null;        
      }


      this.service.salvar(this.professor).subscribe(
        (resp: Resposta) => {
          this.processando = false;
          this.professor = resp.dados;
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

    this.service.excluir(this.professor).subscribe(
      (resp: Resposta) => {
        this.processando = false;
        this.professor = resp.dados;
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