import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbActiveModal, NgbAlertModule, NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Alert, Filtro, Funcoes, Paginacao, Resposta } from '../../../commons/Funcoes';
import { ProfessoresService } from '../professores.service';
import { Professor } from '../professor';
import { ModalAcessoNegadoComponent } from '../../../auth/modal-acessoNegado/modal-acessoNegado.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.services';
import { ModalProfessorComponent } from '../modal-professor/modal-professor.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-modal-professor-selecionar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    HttpClientModule,
    NgbHighlight,
    NgbPaginationModule,
],
  templateUrl: './modal-professor-selecionar.component.html',
  styleUrl: './modal-professor-selecionar.component.css',
  providers: [provideNgxMask(), ProfessoresService, DecimalPipe ],    	     
})

export class ModalProfessorSelecionarComponent implements OnInit {

	@ViewChild("campoPesquisa") campoPesquisa : ElementRef;

	professor : Professor = new Professor;
	lista: Professor[];
	listaOriginal!: Professor[];
	paginacao = new Paginacao;
	alerts: Alert[] = [];
	filtro: Filtro = new Filtro;	
	searchTerm: string = '';

	modoLeitura = false;	
	processando = false;
	desativarBotaoSalvar = false;

	constructor(public activeModal: NgbActiveModal, public service: ProfessoresService, private modalService: NgbModal,private router: ActivatedRoute, private authService: AuthService) {
	}
 
	
  	ngOnInit(): void {
		this.paginacao.pageSize = 10;
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
		const modal = this.modalService.open(ModalProfessorComponent, { size: 'xl' });

    	modal.componentInstance.id =id;            
    
		modal. result.then(() => { 
			this.refresh();			
		}, () => { 
		})


	}	

	selecionar(o: any){
		this.activeModal.close(o);
	}

	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

  matches(professor: Professor, term: string) {
		return (
			("" + professor.nome).toLowerCase().includes(term.toLowerCase())  		
		);
	}



}