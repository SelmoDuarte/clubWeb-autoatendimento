import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule, NgbHighlight, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Alert, Filtro, Funcoes, Resposta } from '../../../commons/Funcoes';
import { ModalAcessoNegadoComponent } from '../../../auth/modal-acessoNegado/modal-acessoNegado.component';
import { Professor } from '../../../tabelas/professores/professor';
import { ModalProfessorComponent } from '../../../tabelas/professores/modal-professor/modal-professor.component';
import { ModalProfessorSelecionarComponent } from '../../../tabelas/professores/modal-professor-selecionar/modal-professor-selecionar.component';
import { BaixaColetivaAtividadeService } from '../baixa-coletiva-ativdade.service';
import { Aluno, BaixaColetivaAtividade } from '../baixa-coletiva-ativdade';
import { of } from 'rxjs';
import { ModalMensagemComponent } from '../../../commons/modal-mensagem/modal-mensagem.component';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FuncoesRelatorio, Linha } from '../../../commons/FuncoesRelatorio';
import { Registro } from '../../../relatorios/financeiro/resumo-caixa/registro';
import { ModalAnaliticoSinteticoComponent } from '../../../commons/modal-analitico-sinteico/modal-analitico-sinteticomensagem.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-modal-baixa-coletiva-atividade',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    NgbHighlight,
    HttpClientModule,
],
  templateUrl: './modal-baixa-coletiva-atividade.component.html',
  styleUrl: './modal-baixa-coletiva-atividade.component.css',
  providers: [provideNgxMask(), BaixaColetivaAtividadeService, DecimalPipe ],    	     
})
export class ModalBaixaColetivaAtividadeComponent implements OnInit {

  @Input() public id: string;
  @Input() public idatividade: string;
  @ViewChild("campoInicial") campoInicial : ElementRef;  
  @ViewChild("campoPesquisa") campoPesquisa : ElementRef;  
  @ViewChild("checkBox_estado") checkBox_estado : ElementRef;  
    
  
  modoLeitura = true;
	processando = true;    
  baixa_coletiva_atividade = new BaixaColetivaAtividade;
  listarSomenteDebitos = 'S';
  
  alerts: Alert[] = [];

  listaTipoCobranca = [];
  listaCategorias = [];
  listaAlunos = [];
  listaAlunosOriginal = [];
  fase = 1;
  
  searchTerm: string = '';

  perfil = ["FINANCEIRO" , "BAIXA-COLETIVA-ATIVIDADE"];

  constructor(
    public activeModal: NgbActiveModal,
    private service: BaixaColetivaAtividadeService,    
    private modalService: NgbModal,    
   ) { }
 
 
  ngOnInit(): void {

	if (! Funcoes.verificaAcesso(this.perfil)){
		var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
		modalRef.componentInstance.papel = this.perfil;
		setTimeout(() => this.activeModal.close(), 10);      
		return;
	}


    this.processando = true;        

    this.service.getCombos().subscribe((resp: Resposta) => {

        this.listaTipoCobranca  = resp.dados.listaTipoCobranca;

        this.processando = false;

        setTimeout(() => this.campoInicial.nativeElement.focus(), 10);

    },(e: any) => { //Error callback
        this.processando = false;		
		if (e.status === 403) {
			var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
			modalRef.componentInstance.papel = this.perfil;
			setTimeout(() => this.activeModal.close(), 10);      
			return;
		}
		this.alerts.push(Funcoes.getErro(e));
    });
}

	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}


  atualizarListaCategorias(){
    	this.processando = true;        	
		this.service.getCategorias(this.baixa_coletiva_atividade.idcobranca).subscribe((resp: Resposta)  => {
			this.processando = false;        
			this.listaCategorias = resp.dados;
		});
	}

	atualizarListaAlunos(){
    this.processando = true;
    var myarr = this.baixa_coletiva_atividade.ano_mes.split("/");
    var ano_mes = myarr[1] + "" + myarr[0];
	this.service.getListaAlunos(ano_mes, this.baixa_coletiva_atividade.idcategoria).subscribe((resp: Resposta)  => {
		this.processando = false;
		this.listaAlunos = resp.dados;
		this.listaAlunosOriginal = resp.dados;
		this.refresh();
		this.campoPesquisa.nativeElement.focus();
	});
	}

	atualizarValor(){
		for (var i = 0; i < this.listaCategorias.length; i++) {
            var t = this.listaCategorias[i];
			if (t.id == this.baixa_coletiva_atividade.idcategoria){
				this.baixa_coletiva_atividade.valor = Number(t.valor);
			}
		}	
	}

  selecionar(o: any){
      if (o.estado == 'P'){
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, não é possível baixar este lançamento !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;

      }
      if (o.selecionado){
        o.selecionado = false;
      }else{
        o.selecionado = true;
      }
	}

  pesquisar() {
		let lista = this.listaAlunosOriginal;

    lista = lista.filter((o) => this.filtro(o));

		// 2. filter
		lista = lista.filter((atividade) => this.matches(atividade, this.searchTerm));

		this.listaAlunos = lista;

		return of({ lista });
	}

  refresh(){
      if (this.checkBox_estado == undefined  || this.checkBox_estado.nativeElement.checked){
  			this.listarSomenteDebitos = 'S';
		    }else{
          this.listarSomenteDebitos = 'N';        
		  }

      var lista = this.listaAlunosOriginal.filter((o) => this.filtro(o));
      this.listaAlunos = lista;

  }

  getNomeAluno(aluno: Aluno){
    if (aluno.nome == null){
      return "NOME NÃO LOCALIZADO " + aluno.idarrecad;
    }else{
      return Funcoes.iniciaisMaiuscula("" + aluno.nome);
    }
    
	}

  getStatus(aluno: Aluno){
    var id = aluno.estado;
		if (id == 'L'){
			return "Lançado";
		}
		if (id == 'G'){
			return 'Gerado';
		}
		if (id == 'P'){
			return 'Pago';
		}
		return id;

	}

  getQtdAlunosSelecionados(){

    var total = 0;
		for (var i = 0; i < this.listaAlunosOriginal.length; i++) {
      var t = this.listaAlunosOriginal[i];
      if (t.selecionado){
        total = total + 1;
      }
    }	
    return total;
  }

  proximo(fase: number){
    if (fase == 2){

      if (undefined == this.baixa_coletiva_atividade.ano_mes || this.baixa_coletiva_atividade.ano_mes == '' || this.baixa_coletiva_atividade.ano_mes.length != 7 ) {
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, mês e ano de referência inválido ou não informado !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;
      }

      if (this.baixa_coletiva_atividade.data == undefined || this.baixa_coletiva_atividade.data == '' || this.baixa_coletiva_atividade.data.length < 10 ) {
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, data da baixa inválida ou não informada !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;
      }

      if (this.baixa_coletiva_atividade.idcobranca == undefined || this.baixa_coletiva_atividade.idcobranca == '' ) {
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, cobrança não informado !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;
      }

      if (this.baixa_coletiva_atividade.idcategoria == undefined || this.baixa_coletiva_atividade.idcategoria == '' ) {
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, categoria não informada !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;
      }

      if (this.baixa_coletiva_atividade.valor == undefined || this.baixa_coletiva_atividade.valor <= 0 ) {
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, valor inválido !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;
      }


      this.atualizarListaAlunos();

      setTimeout(() => (<HTMLElement>document.getElementById('nav-T2-tab')).click(), 10);      
      
    }else{
      setTimeout(() => (<HTMLElement>document.getElementById('nav-T1-tab')).click(), 10);            
    }

    this.fase = fase;

  }

  salvar(){

      if (this.baixa_coletiva_atividade.ano_mes == undefined || this.baixa_coletiva_atividade.ano_mes == '' ) {

        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, mês e ano de referência inválido !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;
      }

      if (this.baixa_coletiva_atividade.idcobranca == undefined || this.baixa_coletiva_atividade.idcobranca == '' ) {
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, cobrança não informado !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;

      }

      if (this.baixa_coletiva_atividade.idcategoria == undefined || this.baixa_coletiva_atividade.idcategoria == '' ) {
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, categoria não informada !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;

      }

      if (this.getQtdAlunosSelecionados() <= 0) {
        var modal = this.modalService.open(ModalMensagemComponent);
        modal.componentInstance.alerts = Array.from([{ type: "danger", message: "<b>ATENÇÃO</b>, nenhum aluno selecionado !!!",  }]);
        setTimeout(() => modal.close(), 1000);        
        return;
      }

      const listaSelecionados = this.listaAlunosOriginal.filter((r) => r.selecionado);

      if (! confirm("Confirma a baixa em lote de " + listaSelecionados.length + " lançamento(s) ?" ) == true) {
        return;
      }		
  
      const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
      this.baixa_coletiva_atividade.idusuario = jsonUsuario.id;  

	  this.processando = true;

      this.service.salvar(listaSelecionados, this.baixa_coletiva_atividade).subscribe(
        (resp: Resposta) => {
          this.processando = false;
          this.listaAlunos = resp.dados;
          this.listaAlunosOriginal = resp.dados;
          this.refresh();
          this.campoPesquisa.nativeElement.focus();

          var modal = this.modalService.open(ModalMensagemComponent);
          modal.componentInstance.alerts = Array.from([{ type: "success", message: "<b>" + listaSelecionados.length +"</b> registro(s) baixado(s), com sucesso !!!",  }]);
          setTimeout(() => modal.close(), 1000);        
  
        },
        (e: any) => { 
		  this.processando = false;
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

  /** INICIO RELATORIO COMPROVANTE BAIXA */

  gerarPDF(): void {
	var fonts = {
		Roboto: {
			normal: 'fonts/Roboto-Regular.ttf',
			bold: 'fonts/Roboto-Medium.ttf',
			italics: 'fonts/Roboto-Italic.ttf',
			bolditalics: 'fonts/Roboto-MediumItalic.ttf'
		}
	};

    var sintetico = 'S';
	const modal = this.modalService.open(ModalAnaliticoSinteticoComponent, );

	modal. result.then((tipo: any) => { 
		sintetico = tipo;

		var filtro = new Filtro;
		filtro.data_inicio = this.baixa_coletiva_atividade.data;
		filtro.categoria = this.baixa_coletiva_atividade.idcategoria;
		filtro.ano_mes = this.baixa_coletiva_atividade.ano_mes;
		filtro.sintetico = sintetico;
		this.processando = true;
		this.service.getListaRelatorio(filtro).subscribe((resp: Resposta)  => {
			var listaRelatorio = resp.dados.lista;
			var registroTotal = resp.dados.total
			if (sintetico == 'S'){
				this.relatorioSintetico(listaRelatorio, registroTotal);
			}else{
				this.relatorioAnalitico(listaRelatorio, registroTotal);
			}
			this.processando = false;			
		});
	}, () => { 

	})
	;			
	}

	getValorTotalPago(e){

		var valor = Number(e.valor_dinheiro) + Number(e.valor_cheque) +	Number(e.valor_cartao) + Number(e.valor_cheque_pre) + Number(e.valor_deposito_bancario) + Number(e.valor_compensacao) + Number(e.valor_pix) + Number(e.valor_retorno_banco) + Number(e.valor_auto_atendimento);

		return (valor);
	}


	relatorioSintetico(listaRelatorio, registroTotal){
		const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
		var usuario = jsonUsuario;
		var data_geracao = (new Date()).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

		var titulo1 = 'Baixa em Lote Analítico';
		var titulo2 = Funcoes.getElementoCombo(this.baixa_coletiva_atividade.idcategoria, this.listaCategorias).descricao;
		var titulo3 = 'Ano Mes Ref: ' + this.baixa_coletiva_atividade.ano_mes;
    	var titulo4 = 'Data: ' + this.baixa_coletiva_atividade.data;

		var conteudo = FuncoesRelatorio.getConteudo( data_geracao, usuario.email, titulo1, titulo2, titulo3, titulo4) ;
	
		var total = 0;
		for (var i = 0; i < listaRelatorio.length; i++){
			var e = <Registro> listaRelatorio[i] ;

			var linha = {
				style: 'tableExample',
				table: {
					widths: ['*'],
					body: [
						[	
							{width: 100,text: e.cobranca, alignment: 'left', fillColor: '#eeeeee',fontSize: 14, bold: true},

						]
					]
				},
				layout: 'noBorders'
			};

			conteudo.content.push({text: '', fontSize: 5, bold: true, margin: [0, 10, 0, 0]});
			conteudo.content.push(linha);
			conteudo.content.push({text: '', fontSize: 2, bold: true, margin: [0, 5, 0, 0]});				

			var subTotalNivel1 = 0;
			for (var j = 0; j < e.listaCategorias.length; j++){
				var ee = <Registro> e.listaCategorias[j] ;

				var linha2 = new Linha;
				linha2.columns.push({width: 100, text: '', alignment: 'left'});
				linha2.columns.push({width: '*',text: ee.categoria, alignment: 'left'});

				conteudo.content.push(linha2);

				var subTotalNivel2 = 0;
				for (var k = 0; k < ee.listaLancamentos.length; k++){
					var eee = <Registro> ee.listaLancamentos[k] ;
					var linha3 = new Linha;		
						
					var valor = Number(eee.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

					linha3.columns.push({width: 150, text: '', alignment: 'left'});
					linha3.columns.push({width: '*',text: eee.ano_mes, alignment: 'left'});
					linha3.columns.push({width: '100',text: valor, alignment: 'right'});

					conteudo.content.push(linha3);

					subTotalNivel2 = subTotalNivel2 + Number(eee.total);
				}
				subTotalNivel1 = subTotalNivel1 + subTotalNivel2;
				var valor = Number(subTotalNivel2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });						
			}
			total = total + subTotalNivel1;
			var valor = Number(subTotalNivel1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });						


			var linha4 = new Linha;
			linha4.columns.push({width: '*', text: '________________________________________________________________________________________' , alignment: 'right'});
			conteudo.content.push(linha4);
				
			var linha5 = new Linha;
			linha5.columns.push({width: '*', text: 'TOTAL : ' +  valor , alignment: 'right'});

			conteudo.content.push(linha5);


		}

		conteudo = this.linhaValorTotal(conteudo, registroTotal);

		conteudo.content.push({text: '', fontSize: 14, bold: true, margin: [0, 50, 0, 8]});

		pdfMake.createPdf(conteudo).download("clubWeb-RelFinanceiroCaixaSintetico.pdf");
	}

	relatorioAnalitico(listaRelatorio, registroTotal){
		const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
		var usuario = jsonUsuario;
		var data_geracao = (new Date()).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

		var titulo1 = 'Baixa em Lote Analítico';
		var titulo2 = Funcoes.getElementoCombo(this.baixa_coletiva_atividade.idcategoria, this.listaCategorias).descricao;
		var titulo3 = 'Ano Mes Ref: ' + this.baixa_coletiva_atividade.ano_mes;
    	var titulo4 = 'Data: ' + this.baixa_coletiva_atividade.data;

		var conteudo = FuncoesRelatorio.getConteudo( data_geracao, usuario.email, titulo1, titulo2, titulo3, titulo4) ;

		var tabela = {
			style: 'tableExample',
			table: {
				widths: ['*', 50, 80],
				headerRows: 1,
				body: [
					[
						{
							text: 'Nome', 
							style: 'header'
						}, 
						{
							text: 'Comp.', 
							style: 'header'
						}, 
						{
							text: 'Valor', 
							style: 'headerEsquerda'
						}
					]
				]
			},
			layout: 'headerLineOnly'
		};

		var total = 0;
		var cssLinha = 'colunaZebra';
		var valor = 0
		for (var i = 0; i < listaRelatorio.length; i++){
			var e = <Registro> listaRelatorio[i] ;

			valor = valor + Number(e.total);
			
			if (i  % 2 !== 0){
				cssLinha = 'colunaZebra';
			}else{
				cssLinha = 'coluna';
			}

			tabela.table.body.push([
				{
					text: e.nome,
					style: cssLinha

				},
				{
					text: e.ano_mes, 
					style: cssLinha
				}, 
				{
					text: e.total_formatado, 
					style: this.getCssAlinharEsquerda(cssLinha)
				}
			]);
		}	
		conteudo.content.push(tabela);
		conteudo = this.linhaValorTotal(conteudo, registroTotal);

		pdfMake.createPdf(conteudo).download("clubWeb-RelFinanceiroCaixaAnalitico.pdf");
	}

	getCssAlinharEsquerda(cssLinha){
		return "" + cssLinha + 'Esquerda';
	}

	linhaValorTotal(conteudo: any, registroTotal: any){

		var linhaTotal = {
			style: 'tableExample',
			table: {
				widths: [300,100, '*'],
				body: [
				]
			},
			layout: 'noBorders'
		};

		var v;
		if (registroTotal.valor_cartao > 0){
			v = Number(registroTotal.valor_cartao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Cartão: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (registroTotal.valor_compensacao > 0){
			v = Number(registroTotal.valor_compensacao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Compensacao: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (registroTotal.valor_dinheiro > 0){
			v = Number(registroTotal.valor_dinheiro).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Dinheiro: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (registroTotal.valor_cheque > 0){
			v = Number(registroTotal.valor_cheque).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Cheque: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (registroTotal.valor_cheque_pre > 0){
			v = Number(registroTotal.valor_cheque_pre).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Cheque pré: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (registroTotal.valor_deposito_bancario > 0){
			v = Number(registroTotal.valor_deposito_bancario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Deposito bancário: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (registroTotal.valor_pix > 0){
			v = Number(registroTotal.valor_pix).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'PIX: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (registroTotal.valor_retorno_banco > 0){
			v = Number(registroTotal.valor_retorno_banco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Retorno banco: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (registroTotal.valor_auto_atendimento > 0){
			v = Number(registroTotal.valor_auto_atendimento).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Auto Atendimento: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}


		linhaTotal.table.body.push(	
			[	
				{},
				{width: 100,text: '', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
				{width: '*', text: "___________________", alignment: 'right', 	fillColor: '#eeeeee'}
			]
		);

		v = Number(this.getValorTotalPago(registroTotal)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
		linhaTotal.table.body.push(	
			[	
				{},
				{width: 100,text: 'VALOR TOTAL', alignment: 'left', fillColor: '#eeeeee',fontSize: 14, bold: true,},
				{width: '*', text: "" + v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 14, bold: true,}
			]
		);


		conteudo.content.push({text: '', fontSize: 14, bold: true, margin: [0, 50, 0, 8]});
		conteudo.content.push(linhaTotal);

		return conteudo;

	}


  /** FIM RELATORIO COMPROVANTE BAIXA  */

  getNomesCSSAlunoStatus(a: Aluno){
		if (a.estado == 'P'){
			return "lancamentoPago";
		}
		return null;
	}

  matches(aluno: Aluno, term: string) {

    return (
      (this.getNomeAluno(aluno)).toLowerCase().includes(term.toLowerCase())  		
    );
  }

  filtro(aluno: Aluno) {
    if (this.listarSomenteDebitos == 'S'){
      if (aluno.estado != 'P'){
        return true;
      }else{
        return false;
      }
    }else{
      return true;
    }
  }



}