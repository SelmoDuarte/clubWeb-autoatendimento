import { Component, Input, OnInit } from '@angular/core';
import { Associado, LancamentoDebito } from '../associado';
import { Alert } from '../../compra-manual/Funcoes';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AssociadosService } from '../associados.service';
import { Funcoes, Resposta } from '../../commons/Funcoes';
import { ModalDependenteComponent } from '../../dependentes/modal-dependente/modal-dependente.component';
import { ModalAcessoNegadoComponent } from '../../auth/modal-acessoNegado/modal-acessoNegado.component';

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
  templateUrl: './modal-associado.component.html',
  styleUrl: './modal-associado.component.css',
  providers: [provideNgxMask(), AssociadosService, DecimalPipe ],    	     
})

export class ModalAssociadoComponent implements OnInit {

  @Input() public id: string;

  listaCategorias = [];
  listaDependentes = [];
  listaSituacoes = [];
  listaCidades = [];
  listaEstadosCivil = [];
  listaEscolaridades = [];
  listaProfissoes = [];
  listaLayoutsBoletos = [];
  listaParentesco = [];
  listaFinanceiroOriginal: LancamentoDebito[];
  listaTipoPesquisa = ['Num. Titulo', 'Matricula', "Nome", "CPF"];
  modoLeitura = true;
  modoLeitura_SPD = true;
  processando = false;

  filtro = new Filtro;

  alerts: Alert[] = [];


  associado = new Associado;

  constructor(
      public activeModal: NgbActiveModal,
      private service: AssociadosService,
      private modalService: NgbModal,
  ) {}


  ngOnInit(): void {

      this.processando = true;


      this.service.getAssociadosCombos().subscribe(
          (resp: Resposta) => {
              if (resp.status.codigo == 0) {
                  this.listaCategorias = resp.dados.listaCategorias;
                  this.listaSituacoes = resp.dados.listaSituacoes;
                  this.listaCidades = resp.dados.listaCidades;
                  this.listaEstadosCivil = resp.dados.listaEstadosCivil;
                  this.listaEscolaridades = resp.dados.listaEscolaridades;
                  this.listaProfissoes = resp.dados.listaProfissoes;
                  this.listaLayoutsBoletos = resp.dados.listaLayoutsBoletos;
                  this.listaParentesco = resp.dados.listaParentesco;

                  this.service.getAssociadoByID(this.id).subscribe(
                      (resp: Resposta) => {
                          if (resp.status.codigo == 0) {
                              this.associado = resp.dados[0];

                              this.processando = false;

                              this.service.getAssociadoDetalhes(this.id).subscribe(
                                  (resp: Resposta) => {
                                      if (resp.status.codigo == 0) {
                                          this.associado.listaCartoesSocial = resp.dados.listaCartoesSocial;
                                          this.associado.listaAcessosTemporario = resp.dados.listaAcessosTemporario;
                                          this.associado.listaDependentes = resp.dados.listaDependentes;
                                          this.associado.listaFinanceiro = resp.dados.listaFinanceiro;
                                          this.listaFinanceiroOriginal = resp.dados.listaFinanceiro;
                                          this.associado.listaFinanceiro = resp.dados.listaFinanceiro;
                                          this.associado.listaAtividades = resp.dados.listaAtividades;

                                          this.filtroListaFinanceira();

                                      } else {
                                          this.associado = new Associado;
                                          this.processando = false;
                                      }
                                  });

                          }
                      });

              }
          });


  }

  openModalDependente(p: any) {


      var id = p.iddependente;
      const modal = this.modalService.open(ModalDependenteComponent, {
          size: 'lg'
      });
      modal.componentInstance.id = id;

      modal.result.then(() => {

      }, () => {

      })

  }


  filtroListaFinanceira() {
      var c = ( < HTMLInputElement > document.getElementById('checkboxLancamentosAbertos'));
      if (c.checked) {
          var lista = this.listaFinanceiroOriginal;
          lista = lista.filter((lancamentoDebito) => this.matchesFinanceiro(lancamentoDebito, 'P'));
          this.associado.listaFinanceiro = lista;

      } else {
          this.associado.listaFinanceiro = this.listaFinanceiroOriginal;
      }

  }

  matchesFinanceiro(lancamentoDebito: LancamentoDebito, term: string) {
      return (("" + lancamentoDebito.estado).toLowerCase() != term.toLowerCase());
  }


  getDescricaoParentesco(id: string) {
      return Funcoes.getElementoCombo(id, this.listaParentesco).descricao;
  }


  getDescricaoCategoria(id: string) {
      return Funcoes.getElementoCombo(id, this.listaCategorias).descricao;
  }

  getMesAnoLancamento(data: string) {
      var dt = data.toString()
      return dt.substring(4, 6) + "/" + dt.substring(0, 4);
  }


  closeAlert(alert: Alert) {
      this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  editar() {

      var perfis = [];
      perfis.push('ASSOCIADOS-MANUTENCAO');

      if (!Funcoes.verificaAcesso(perfis)) {
          var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
          modalRef.componentInstance.papel = perfis;
          setTimeout(() => this.activeModal.close(), 10);
          return;

      }
      this.modoLeitura_SPD = false;
  }


  salvar() {

    this.associado.categoria_descricao = Funcoes.getElementoCombo(this.associado.idcateg_soc, this.listaCategorias).descricao;

    this.service.salvar(this.associado).subscribe(
      (resp: Resposta) => {
        this.processando = false;
        const alert =  new Alert;
        alert.type = 'success';
        alert.message = 'Associado salvo com sucesso !!!';
        this.alerts = [];
        this.alerts.push(alert);
        setTimeout(() => this.activeModal.close(), 1000);        
      },
      (e: any) => { 
        this.alerts = [];
        this.alerts.push(Funcoes.getErro(e));
        this.processando = false;
      }
      );

  }

  excluir() {

  }

  getPathFoto(nome_arquivo: string) {
      return 'https://minasbrasilia.app.br/fotos/Titular/' + nome_arquivo;
  }

}

class Filtro {
  debitosAbertos: string = 'S';
}