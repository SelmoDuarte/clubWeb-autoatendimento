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
import { AtividadeService } from './atividades.service';
import { Atividade } from './atividade';
import { AuthService } from '../../auth/auth.services';
import { Filtro, Alert, Paginacao, Resposta, Funcoes } from '../../commons/Funcoes';
import { of } from 'rxjs';
import { ModalAtividadeComponent } from './modal-atividade/modal-atividade.component';

@Component({
	selector: 'app-secoes',
	standalone: true,
	imports: [CommonModule, RouterLink, FormsModule, AsyncPipe, NgbHighlight, NgbPaginationModule, CKEditorModule, FileUploadModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe, NgbAlertModule ],
	templateUrl: './atividades.component.html',
	styleUrl: './atividades.component.css',  
	providers: [provideNgxMask(), AtividadeService, DecimalPipe ],
})


export class TabelaListaAtividadesComponent implements OnInit{

	@ViewChild("campoPesquisa") campoPesquisa : ElementRef;

	atividade : Atividade = new Atividade;
	lista: Atividade[];
	listaOriginal!: Atividade[];
	paginacao = new Paginacao;
	alerts: Alert[] = [];
	filtro: Filtro = new Filtro;	
	searchTerm: string = '';

	modoLeitura = false;	
	processando = false;
	desativarBotaoSalvar = false;

	constructor(public service: AtividadeService, private modalService: NgbModal,private router: ActivatedRoute, private authService: AuthService) {
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
		const modal = this.modalService.open(ModalAtividadeComponent, { size: 'xl' });

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

	 matches(atividade: Atividade, term: string) {
		return (
			atividade.nome.toLowerCase().includes(term.toLowerCase())  		
		);
	}
	
}
