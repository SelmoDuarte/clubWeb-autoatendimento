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
import { TurmaService } from './turmas.service';
import { Turma } from './turma';
import { ModalTurmaComponent } from './modal-turma/modal-turma.component';

@Component({
	selector: 'app-turmas',
	standalone: true,
	imports: [CommonModule, RouterLink, FormsModule, AsyncPipe, NgbHighlight, NgbPaginationModule, CKEditorModule, FileUploadModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe, NgbAlertModule ],
	templateUrl: './turmas.component.html',
	styleUrl: './turmas.component.css',  
	providers: [provideNgxMask(), TurmaService, DecimalPipe ],
})


export class TabelaListaTurmasComponent implements OnInit{

	@ViewChild("campoPesquisa") campoPesquisa : ElementRef;

	turma : Turma = new Turma;
	lista: Turma[];
	listaOriginal!: Turma[];
	paginacao = new Paginacao;
	alerts: Alert[] = [];
	filtro: Filtro = new Filtro;	
	searchTerm: string = '';

	modoLeitura = false;	
	processando = false;
	desativarBotaoSalvar = false;

	constructor(public service: TurmaService, private modalService: NgbModal,private router: ActivatedRoute, private authService: AuthService) {
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
			this.lista = resp.dados.lista;
			this.listaOriginal = resp.dados.lista;			
			this.paginacao.total = this.lista.length;
			this.processando = false;			
			this.pesquisar();
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
		const modal = this.modalService.open(ModalTurmaComponent, { size: 'xl' });

    	modal.componentInstance.id =id;            
    
		modal. result.then(() => { 
		  this.refresh();

		}, () => { 

		})
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

	 matches(o: any, term: string) {
		return (
			o.nome.toLowerCase().includes(term.toLowerCase())  		
		);
	}
	
}
