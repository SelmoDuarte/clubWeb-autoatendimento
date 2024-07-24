import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbHighlight, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx'; 
import { AuthService } from '../../auth/auth.services';
import { Filtro, Alert, Paginacao, Resposta, Funcoes } from '../../commons/Funcoes';
import { of } from 'rxjs';
import { TabelaCobrancaService } from './cobranca.service';
import { Cobranca } from './cobranca';
import { ModalTabelaCobrancaComponent } from './modal-cobrancas/modal-cobranca.component';

@Component({
	selector: 'app-tabelas-cobranca',
	standalone: true,
	imports: [CommonModule, RouterLink, FormsModule, AsyncPipe, NgbHighlight, NgbPaginationModule, CKEditorModule, FileUploadModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe, NgbAlertModule ],
	templateUrl: './cobranca.component.html',
	styleUrl: './cobranca.component.css',  
	providers: [provideNgxMask(), TabelaCobrancaService, DecimalPipe ],
})

export class TabelaListaCobrancasComponent implements OnInit{
	
	@ViewChild("campoPesquisa") campoPesquisa : ElementRef;

	cobranca : Cobranca = new Cobranca;
	lista: Cobranca[];
	listaOriginal!: Cobranca[];
	paginacao = new Paginacao;
	alerts: Alert[] = [];
	filtro: Filtro = new Filtro;	
	searchTerm: string = '';

	modoLeitura = false;	
	processando = false;
	desativarBotaoSalvar = false;

	constructor(public service: TabelaCobrancaService, private modalService: NgbModal,private router: ActivatedRoute, private authService: AuthService) {
	}

	ngOnInit(): void {

		this.refresh();

	}

	ngAfterViewInit() {
		this.campoPesquisa.nativeElement.focus();
	}
	
	refresh(){
	
		this.processando = true;
		
		this.service.getLista(this.filtro).subscribe((resp: Resposta) => {
			this.lista = resp.dados;
			this.listaOriginal = resp.dados;			
			this.paginacao.total = this.lista.length;
			this.pesquisar();
			this.processando = false;			
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

		this.alerts = [];
		const modal = this.modalService.open(ModalTabelaCobrancaComponent, { size: 'xl' });

    	modal.componentInstance.id =id;            

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
		XLSX.writeFile(wb, 'listaParticipantes.xlsx');
			 
	 }

	 matches(cobranca: Cobranca, term: string) {
		return (
			("" + cobranca.DESCR).toLowerCase().includes(term.toLowerCase())  		
		);
	}
	
}