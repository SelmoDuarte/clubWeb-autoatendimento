import { AsyncPipe, CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbHighlight, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx'; 
import { of } from 'rxjs';
import { Registro, RegistroTotal } from './registro';
import { RelatorioFinanceiroResumoCaixaService } from './resumo-caixa.service';
import { AuthService } from '../../../auth/auth.services';
import { Alert, Filtro, Funcoes, Paginacao, Resposta } from '../../../commons/Funcoes';
import { ModalAssociadoComponent } from '../../../associados/modal-associado/modal-associado.component';
import { ModalAcessoNegadoComponent } from '../../../auth/modal-acessoNegado/modal-acessoNegado.component';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FuncoesRelatorio, Linha } from '../../../commons/FuncoesRelatorio';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
	selector: 'app-relatorio-financeiro-resumo-caixa',
	standalone: true,
	imports: [CommonModule, RouterLink, FormsModule, AsyncPipe, NgbHighlight, NgbPaginationModule, CKEditorModule, FileUploadModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe, NgbAlertModule ],
	templateUrl: './resumo-caixa.component.html',
	styleUrl: './resumo-caixa.component.css',  
	providers: [provideNgxMask(), RelatorioFinanceiroResumoCaixaService, DecimalPipe, NgbActiveModal ],
})


export class RelatorioFinanceiroResumoCaixaComponent implements OnInit{
	
	@ViewChild("campoPesquisa") campoPesquisa : ElementRef;
	@ViewChild("campoInicial") campoInicial : ElementRef;
	@ViewChild("campoData") campoData: ElementRef;
	@ViewChild("checkBox_filtro_sintetico") checkBox_filtro_sintetico : ElementRef;  	

	listaUsuarios: any[];	
	listaTiposPagamento: any[]; 
	listaLayouts: any[];

	lista: Registro[] = [];
	listaOriginal: Registro[] = [];
	

	paginacao = new Paginacao;
	alerts: Alert[] = [];
	filtro: Filtro = new Filtro;	
	searchTerm: string = '';
	registroTotal = new RegistroTotal;

	modoLeitura = false;	
	processando = false;
	desativarBotaoSalvar = false;

	perfil = ['RELATORIO', 'FINANCEIRO-RECEITA'];

	constructor(
		public activeModal: NgbActiveModal,		
		public service: RelatorioFinanceiroResumoCaixaService, 
		private modalService: NgbModal,
		private router: ActivatedRoute, 
		private authService: AuthService
	) {

	}

	ngOnInit(): void {

		if (! Funcoes.verificaAcesso(this.perfil)){
			var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
			modalRef.componentInstance.papel = this.perfil;
			setTimeout(() => this.activeModal.close(), 10);      
			return;
		}

		var data = new Date();
//		data.setDate((new Date()).getDate() - 1); 
		
		this.filtro.data_inicio = data.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
		this.filtro.data_fim = data.toLocaleDateString('pt-BR', {timeZone: 'UTC'});		
		this.filtro.tipo_pagamento = '1';
		this.filtro.sintetico = 'S'

		this.service.getCombos().subscribe((resp: Resposta) => {

			this.listaUsuarios  = resp.dados.listaUsuarios;
			this.listaTiposPagamento = resp.dados.listaTiposPagamento;
			this.listaLayouts = resp.dados.listaLayouts;

		setTimeout(() => this.campoInicial.nativeElement.focus(), 10);      

		},(e: any) => { //Error callback
			this.alerts.push(Funcoes.getErro(e));
			this.processando = false;
		});


	}

	ngAfterViewInit() {
		this.campoInicial.nativeElement.focus();
	}
	
	refreshTipoPagamento(){
		this.filtro.usuario = '';
		this.filtro.layout = '';
		this.refresh();
	}

	refreshUsuario(){
		this.filtro.layout = '';
		this.refresh();
	}

	refreshLayout(){
		this.filtro.usuario = '';
		this.refresh();
	}

	refresh(){
	
		this.processando = true;

		if (this.checkBox_filtro_sintetico == undefined  || this.checkBox_filtro_sintetico.nativeElement.checked){
			this.filtro.sintetico = 'S';
		  }else{
			this.filtro.sintetico = 'N';        
		}

		if ((this.filtro.data_inicio  == undefined || this.filtro.data_inicio == '') ){
			const alert =  new Alert;
			alert.type = 'danger';
			alert.message = 'Informe a Data para a pesquisa   !!!';
			this.alerts = [];
			this.alerts.push(alert);
			this.campoData.nativeElement.focus();
			this.processando = false;
			return;
		}
	

		this.service.getLista(this.filtro).subscribe((resp: Resposta) => {
			this.lista = resp.dados.lista;
			this.listaOriginal = resp.dados.lista;			
			this.registroTotal = resp.dados.total;			
			this.paginacao.total = this.lista.length;
			this.pesquisar();

			if (this.filtro.sintetico == 'S'){

				for (var i = 0; i < this.listaOriginal.length; i++){
					var e = this.listaOriginal[i] ;
					var total = 0;
					for (var ii= 0; ii < e.listaCategorias.length; ii++){
						var ee = e.listaCategorias[ii] ;
						var totalNivel1  = 0;
						for (var iii= 0; iii < ee.listaLancamentos.length; iii++){
							var eee = ee.listaLancamentos[iii] ;
							totalNivel1 = totalNivel1 + Number(eee.total);
						}
						ee.total = totalNivel1;
						total = total + totalNivel1;
					}
					e.total = total;	
				}
				this.listaOriginal = this.listaOriginal.sort((a, b) => b.total - a.total);
				this.lista = this.listaOriginal;
  
			}

			this.processando = false;			
		},(e: any) => { //Error callback
			this.alerts.push(Funcoes.getErro(e));
			this.processando = false;
		});
	
	}

	getNomesCSSLancamento(r: Registro){
		if (Number(r.total) <= 0){
			return "valorNegativo";
		}
		return null;
	}

	getNomesCSSValorPagoDiferente(r: Registro){
		if (Number(r.total) != this.getValorTotalPago(r)){
			return "valorNegativo";
		}
		return null;
	}


	pesquisar() {
		let lista = this.listaOriginal;

		// 2. filter
		lista = lista.filter((atividade) => this.matches(atividade, this.searchTerm));
		const total = lista.length;

		// 3. paginate
		lista = lista.slice((this.paginacao.page - 1) * this.paginacao.pageSize, (this.paginacao.page - 1) * this.paginacao.pageSize + this.paginacao.pageSize);

		this.lista = lista;
		this.paginacao.total = total;
		
		return of({ lista, total });
	}

	openModal(id: string) {

		if (id == null){
			var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
			return;
		}

		this.alerts = [];
		const modal = this.modalService.open(ModalAssociadoComponent, { size: 'xl' });

    	modal.componentInstance.id =id;            
    
		modal. result.then(() => { 
			this.refresh();			
		})

	}	

	getValorTotal(){
		var valor = 0;
		var e!: any;
		if (this.listaOriginal == undefined){
			return null;
		}


		for (var i = 0; i < this.listaOriginal.length; i++){
	  			e = this.listaOriginal[i] ;
			valor = valor + Number(e.total);
	  
		}
		return valor;
	
	}

	onChange(event: any): void {

	}

	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

	exportexcel(): void {
		/* table id is passed over here */   
		let element = document.getElementById('excel-table'); 
		const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
		/* save to file */
		XLSX.writeFile(wb, 'relClubWeb-FinanceiroResumo-'+this.filtro.valor +'.xlsx');
			 
	 }

	gerarPDF(): void {

		var fonts = {
			Roboto: {
				normal: 'fonts/Roboto-Regular.ttf',
				bold: 'fonts/Roboto-Medium.ttf',
				italics: 'fonts/Roboto-Italic.ttf',
				bolditalics: 'fonts/Roboto-MediumItalic.ttf'
			}
		};

		if (this.listaOriginal == undefined){
			const alert =  new Alert;
			alert.type = 'danger';
			alert.message = 'Informe um filtro de pesquisa   !!!';
			this.alerts = [];
			this.alerts.push(alert);
			this.campoData.nativeElement.focus();
			this.processando = false;
			return;
		}
		
		if (this.filtro.sintetico == 'S'){
		
			this.relatorioSintetico(this.listaOriginal);
		
		}else{
			this.relatorioAnalitico(this.listaOriginal);
		}
			
	}

	getValorTotalPago(e){

		var valor = Number(e.valor_dinheiro) + Number(e.valor_cheque) +	Number(e.valor_cartao) + Number(e.valor_cheque_pre) + Number(e.valor_deposito_bancario) + Number(e.valor_compensacao) + Number(e.valor_pix) + Number(e.valor_retorno_banco) + Number(e.valor_auto_atendimento);

		return (valor);
	}


	 matches(registro: Registro, term: string) {
		return (
			("" + registro.nome).toLowerCase().includes(term.toLowerCase()) ||
			("" + registro.valor).toLowerCase().includes(term.toLowerCase()) ||
			("" + registro.cobranca).toLowerCase().includes(term.toLowerCase()) ||
			("" + registro.categoria).toLowerCase().includes(term.toLowerCase()) ||
			("" + registro.tipo_pagamento_descricao).toLowerCase().includes(term.toLowerCase()) ||
			("" + registro.usuario_nome).toLowerCase().includes(term.toLowerCase()) ||
			("" + registro.idrecibo).toLowerCase().includes(term.toLowerCase()) 			
		);
	}
	
	relatorioSintetico(listaRelatorio){
		const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
		var usuario = jsonUsuario;
		var data_geracao = (new Date()).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

		var titulo1 = 'Relatório de Receita Sintético';
		var titulo2 = '';
		var titulo3 = 'Periodo: ' + this.filtro.data_inicio + " a " + this.filtro.data_fim;
		var titulo4 = '';				
		if (this.filtro.tipo_pagamento != ''){
			var tipo_pagamento_descricao = (Funcoes.getElementoCombo(this.filtro.tipo_pagamento, this.listaTiposPagamento)).descricao;					
			titulo2 = 'Tipo pagamento : ' + tipo_pagamento_descricao;

			if (this.filtro.layout != ''){
				titulo2 = Funcoes.getElementoCombo(this.filtro.layout, this.listaLayouts).descricao;
			}

			if (this.filtro.tipo_pagamento == '1' && (this.filtro.usuario != null && this.filtro.usuario != '')){
				var usuario_descricao = (Funcoes.getElementoCombo(this.filtro.usuario, this.listaUsuarios)).descricao;
				titulo4 = 'Atendente : ' + usuario_descricao;
			}
		}

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

		conteudo = this.linhaValorTotal(conteudo);

		conteudo.content.push({text: '', fontSize: 14, bold: true, margin: [0, 50, 0, 8]});

		pdfMake.createPdf(conteudo).download("clubWeb-RelFinanceiroCaixaSintetico.pdf");

	}

	relatorioAnalitico(listaRelatorio){
		const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
		var usuario = jsonUsuario;
		var data_geracao = (new Date()).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

		var titulo1 = 'Relatório de Receita Analitico';
		var titulo2 = '';
		var titulo3 = 'Periodo: ' + this.filtro.data_inicio + " a " + this.filtro.data_fim;
		var titulo4 = '';				
		if (this.filtro.tipo_pagamento != ''){
			var tipo_pagamento_descricao = (Funcoes.getElementoCombo(this.filtro.tipo_pagamento, this.listaTiposPagamento)).descricao;					
			titulo2 = 'Tipo pagamento : ' + tipo_pagamento_descricao;
			if (this.filtro.tipo_pagamento == '1' && (this.filtro.usuario != null && this.filtro.usuario != '')){
				var usuario_descricao = (Funcoes.getElementoCombo(this.filtro.usuario, this.listaUsuarios)).descricao;
				titulo4 = 'Atendente : ' + usuario_descricao;
			}
		}

		var conteudo = FuncoesRelatorio.getConteudo( data_geracao, usuario.email, titulo1, titulo2, titulo3, titulo4) ;

		var tabela = {
			style: 'tableExample',
			table: {
				widths: [50, '*', 50, 80],
				headerRows: 1,
				body: [
					[
						{
							text: 'Nº Tit', 
							style: 'header'
						}, 
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
					text: e.titulo, 
					style: cssLinha
				},
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
		conteudo = this.linhaValorTotal(conteudo);

		pdfMake.createPdf(conteudo).download("clubWeb-RelFinanceiroCaixaAnalitico.pdf");

	}

	getCssAlinharEsquerda(cssLinha){
		return "" + cssLinha + 'Esquerda';
	}

	linhaValorTotal(conteudo: any){

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

		if (this.registroTotal.valor_retorno_banco > 0){
			v = Number(this.registroTotal.valor_retorno_banco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Retorno banco: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}


		if (this.registroTotal.valor_cartao > 0){
			v = Number(this.registroTotal.valor_cartao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Cartão: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (this.registroTotal.valor_pix > 0){
			v = Number(this.registroTotal.valor_pix).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'PIX: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (this.registroTotal.valor_compensacao > 0){
			v = Number(this.registroTotal.valor_compensacao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Compensacao: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (this.registroTotal.valor_dinheiro > 0){
			v = Number(this.registroTotal.valor_dinheiro).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Dinheiro: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (this.registroTotal.valor_auto_atendimento > 0){
			v = Number(this.registroTotal.valor_auto_atendimento).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Auto Atendimento: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}



		if (this.registroTotal.valor_cheque > 0){
			v = Number(this.registroTotal.valor_cheque).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Cheque: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (this.registroTotal.valor_cheque_pre > 0){
			v = Number(this.registroTotal.valor_cheque_pre).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Cheque pré: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
					{width: '*',text: v, alignment: 'right', 	fillColor: '#eeeeee',fontSize: 12}
				]
			);
		}

		if (this.registroTotal.valor_deposito_bancario > 0){
			v = Number(this.registroTotal.valor_deposito_bancario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			linhaTotal.table.body.push(	
				[	
					{},
					{width: 100,text: 'Deposito bancário: ', alignment: 'left', fillColor: '#eeeeee',fontSize: 12},
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

		v = Number(this.getValorTotalPago(this.registroTotal)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
}

