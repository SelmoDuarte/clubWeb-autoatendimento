import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx'; 

import { of } from 'rxjs';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Associado, Debito } from './associado';
import { AssociadosService } from '../../../associados/associados.service';
import { Alert, Filtro, Funcoes, Resposta } from '../../../commons/Funcoes';
import { ModalAssociadoComponent } from '../../../associados/modal-associado/modal-associado.component';
import { ModalDependenteComponent } from '../../../dependentes/modal-dependente/modal-dependente.component';
import { ModalNaoSocioComponent } from '../../../nao-socios/modal-nao-socio/modal-nao-socio.component';
import { FuncoesRelatorio, Linha } from '../../../commons/FuncoesRelatorio';
import { RelatorioAssociadosConvenioService } from './associados-convenio.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
	selector: 'app-relatorio-associados-convenio',
	standalone: true,
	imports: [CommonModule, RouterLink, FormsModule, AsyncPipe, NgbHighlight, NgbPaginationModule, CKEditorModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe, NgbAlertModule  ],
	templateUrl: './associados-convenio.component.html',
	styleUrl: './associados-convenio.component.css',  
	providers: [provideNgxMask(), RelatorioAssociadosConvenioService, AssociadosService, DecimalPipe ]
})


export class RelatorioAssociadosConvenioComponent implements OnInit{

	@ViewChild("campoPesquisa") campoPesquisa : ElementRef;
	@ViewChild("campoInicial") campoInicial : ElementRef;	

	listaConvenios: any;

	listaRelOriginal = [];
	listaRel = [];
	alerts: Alert[] = [];
	filtro: Filtro = new Filtro;	
	numTotalRegistros: number = 0; 	
	searchTerm = "";
	
	paginacao  = {
		page: 1,
		pageSize: 100,
		searchTerm: '',
		sortColumn: '',
		sortDirection: '',
		total: 0
		};

	tipo: any = null;

	modoLeitura = false;	
	processando = false;
	desativarBotaoSalvar = false;

	@ViewChild('dataToExport', { static: false }) 
	public dataToExport: ElementRef;

	constructor(
		public service: RelatorioAssociadosConvenioService, 
		private modalService: NgbModal,
		private associadoService: AssociadosService
	) {

	}

	ngOnInit(): void {

		this.filtro.situacao_financeira = 'T';
		this.filtro.somenteAtivos = 'S';
		this.processando = true;

		this.service.getConvenios().subscribe((resp: Resposta) => {
			this.listaConvenios = resp.dados;
			this.filtro.convenio = '';
			this.refresh();
			this.processando = false;
		});
		
	}

	ngAfterViewInit() {
		this.campoInicial.nativeElement.focus();
	}
	
	openModal(p : any) {

		var modal!: any;
		modal = this.modalService.open(ModalAssociadoComponent, { size: 'xl' });
		modal.componentInstance.id = p.idassociado;        
		
		modal. result.then(() => { 
			this.refresh();
		}, () => { 

		})
	}

	refresh(){

		this.processando = true;
		this.service.relatorioConvenios(this.filtro).subscribe((resp: Resposta)  => {
			var jData = resp.dados;
			jData.sort((a, b) => (a.nome > b.nome ? 1 : -1));
			this.listaRel = jData;
			this.listaRelOriginal = jData;
			this.processando = false;	
			this.campoPesquisa.nativeElement.focus();	
			this.paginacao.total = this.listaRel.length;
		});
	
	}


	filtrar() {
		const { sortColumn, sortDirection, pageSize, page } = Funcoes.state;

		// 1. sort
		let lista = this.listaRelOriginal;

		// 2. filter
		lista = lista.filter((associado) => this.matches(associado, this.searchTerm));
		var termo = '';
			
		lista = lista.filter((associado) => this.matchesTurmas(associado, termo));

		lista = lista.filter((associado) => this.matchesFinanceiro(associado, this.filtro.situacao_financeira));
		const total = lista.length;
		this.paginacao.total = total;

		// 3. paginate
		lista = lista.slice((this.paginacao.page - 1) * this.paginacao.pageSize, (this.paginacao.page - 1) * this.paginacao.pageSize + this.paginacao.pageSize);

		this.listaRel = lista;
		
		return of({ lista, total });
	}

	getMesAnoLancamento(data: string){
		var dt = data.toString()
		return dt.substring(4,6) + "/" + dt.substring(0,4);
	}

	getTipoAluno(id: string){
		if (id == 'D'){
			return "Dependente";
		}
		if (id == 'N'){
			return "Não Sócio";
		}
		if (id == 'S'){
			return "Sócio";
		}
		return "";
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
		XLSX.writeFile(wb, 'relClubWeb-Atividades.xlsx');
			 
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

	this.relatorio(this.listaRel);
		
}

getValorTotalPago(e){

	var valor = Number(e.valor_dinheiro) + Number(e.valor_cheque) +	Number(e.valor_cartao) + Number(e.valor_cheque_pre) + Number(e.valor_deposito_bancario) + Number(e.valor_compensacao) + Number(e.valor_pix) + Number(e.valor_retorno_banco) + Number(e.valor_auto_atendimento);

	return (valor);
}


relatorio(listaRelatorio){
	const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
	var usuario = jsonUsuario;
	var data_geracao = (new Date()).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

	var titulo1 = 'Financeiro por Atividade';
	var titulo2 = 'Atividade : ' + Funcoes.getElementoCombo(this.filtro.atividade, this.listaConvenios).descricao;
	var titulo3 = ''
	var titulo4 = '';	

	var conteudo = FuncoesRelatorio.getConteudo( data_geracao, usuario.email, titulo1, titulo2, titulo3, titulo4) ;

	var total = 0;
	for (var i = 0; i < listaRelatorio.length; i++){
		var e = <Associado> listaRelatorio[i] ;

		var linha = {
			style: 'tableExample',
			table: {
				widths: ['*','*',50],
				body: [
					[	
						{text: e.nome, fontSize: 10, fillColor: '#eeeeee',},
						{text: '', fontSize: 10, fillColor: '#eeeeee',},
						{text: '', fontSize: 10, fillColor: '#eeeeee',}						

					]
				]
			},
			layout: 'noBorders'
		};

		conteudo.content.push({text: '', fontSize: 5, bold: true, margin: [0, 10, 0, 0]});
		conteudo.content.push(linha);
		conteudo.content.push({text: '', fontSize: 2, bold: true, margin: [0, 5, 0, 0]});				

		var subTotalNivel1 = 0;
		for (var j = 0; j < e.listaDebitos.length; j++){
			var ee = <Debito> e.listaDebitos[j] ;

			var linha2 = new Linha;		
						
			var valor = Number(ee.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

			linha2.columns.push({width: 150, text: '', alignment: 'left'});
			linha2.columns.push({width: '*',text: this.getMesAnoLancamento(ee.ano_mes) + " - " + ee.descricao + '/' + ee.categoria, alignment: 'left', fontSize: 9});
			linha2.columns.push({width: '100',text: valor, alignment: 'right', fontSize: 9});

			conteudo.content.push(linha2);
			subTotalNivel1  = subTotalNivel1  + Number(ee.valor);

		}
		total = total + subTotalNivel1;
		if (subTotalNivel1 > 0) {

			var valor = Number(subTotalNivel1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });						


			var linha4 = new Linha;
			linha4.columns.push({width: '*', text: '________________________________________________________________________________________' , alignment: 'right'});
			conteudo.content.push(linha4);
				
			var linha5 = new Linha;
			linha5.columns.push({width: '*', text: 'TOTAL : ' +  valor , alignment: 'right' , fontSize: 9});
	
			conteudo.content.push(linha5);
		
		}

	}

//	conteudo = this.linhaValorTotal(conteudo, registroTotal);

	conteudo.content.push({text: '', fontSize: 14, bold: true, margin: [0, 50, 0, 8]});

	pdfMake.createPdf(conteudo).download("clubWeb-RelFinanceiroCaixaSintetico.pdf");

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


	 matches(a: Associado, term: string) {
		return (
		("" + a.nome).toLowerCase().includes(term.toLowerCase()) ||
		("" + this.getTipoAluno(a.tp_aluno)).toLowerCase().includes(term.toLowerCase()) ||		
		("" + a.turma).toLowerCase().includes(term.toLowerCase()) ||		
		("" + a.id).toLowerCase().includes(term.toLowerCase()) 		

		);
	}

	matchesTurmas(associado: Associado, term: string) {
		if (term == ''){
			return true;
		}else{
			return (("" + associado.turma).toLowerCase() == term.toLowerCase());
		}	
	}

	matchesFinanceiro(associado: Associado, term: string) {
		if (term == '' || term == 'T'){
			return true;
		}else if(term == 'I' && associado.debitos !== null ) {
			return true;
		}else if(term == 'A' && associado.debitos == null) {
			return true;
		}else{
			return false;
		}	
	}

}
class Categoria {
	id!: string;
	descricao!: string;
}