import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbHighlight, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader, SortEvent } from './sortable.directives';
import { Observable, of } from 'rxjs';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { FileItem, FileUploadModule, FileUploader, ParsedResponseHeaders, } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { environment } from '../../environments/environment';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ParticipanteService } from './participantes.service';
import { Participante } from './participante';
import { AuthService } from '../auth/auth.services';
import * as XLSX from 'xlsx'; 
import { Funcoes, Resposta } from '../commons/Funcoes';

@Component({
	selector: 'app-secoes',
	standalone: true,
	imports: [CommonModule, RouterLink, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule, CKEditorModule, FileUploadModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe, NgbAlertModule ],
	templateUrl: './participantes.component.html',
	styleUrl: './participantes.component.css',  
	providers: [provideNgxMask(), ParticipanteService, DecimalPipe ],
})


export class ParticipantesComponent implements OnInit{
	participante : Participante = new Participante;
	listaParticipantes!: Participante[];
	listaParticipantesOriginal!: Participante[];
	total$!: number;
	alerts: Alert[] = [];
	filtro: Filtro = new Filtro;	
	numTotalRegistros: number = 0; 	
	checkBoxELink: boolean = false;
	checkBoxAtivo: boolean = false;
	checkBoxStatus: boolean = true;	
	confirmados = 'S';
	a: string = "";
	searchTerm: string = '';


	listaEventos: any = [];
	listaTitular: any = [{id:'Sim', descricao: 'Sim'}, {id: 'Não', descricao: 'Não'}];
	listaStatusPagamento = [{id: "1", descricao: "Pendente"}, {id: "2", descricao: "Pago"}, {id: "3", descricao: "Negado"}, {id: "4", descricao: "Expirado"}, {id: "5", descricao: "Cancelado"}, {id: "6", descricao: "Não finalizado"}, {id: "7", descricao: "Autorizado"}, {id: "8", descricao: "ChargeBack"}]	

	tipo: any = null;


	modoLeitura = false;	
	processando = false;
	desativarBotaoSalvar = false;

	name = "ng2-ckeditor";
	ckeConfig: any;
	mycontent!: string;
	log: string = "";
	@ViewChild("myckeditor") ckeditor: any;
	@ViewChildren(NgbdSortableHeader)  headers!: QueryList<NgbdSortableHeader>;

	constructor(public service: ParticipanteService, private modalService: NgbModal,private router: ActivatedRoute, private authService: AuthService) {


	}
	ngOnInit(): void {

		this.processando = false;

        this.service.getEventos()
        .subscribe(
        (response: any) => {
			this.listaEventos = response.listaEventos;
			this.filtro.evento = this.listaEventos[0].nome;
			this.processando = false;			
			this.refresh();			
        },
        (erroResponse) => {
          alert(erroResponse);
          
        });              

	}

	refresh(){

		var checkBoxFiltroStatusPagamento = document.getElementById('checkBoxStatus') as HTMLInputElement;
		if (checkBoxFiltroStatusPagamento !== null){
			if (checkBoxFiltroStatusPagamento.checked){
				this.filtro.confirmados = true;
			}else{
				this.filtro.confirmados = false;
			}
		}	
		

		this.processando = true;

        this.service.getParticipantes("" + this.router.snapshot.paramMap.get("tipo"), this.filtro)
        .subscribe(
        (response: any )=> {
			this.listaParticipantesOriginal = response.dados;
			this.listaParticipantes = response.dados;			
			this.pesquisar();
			this.listaEventos = response.listaEventos;
			this.processando = false;			
        },
        (erroResponse) => {
          alert(erroResponse);
          
        });              
	
	}

	salvar(): void {

		if (! this.isValidCPF(this.participante.matricula_id)){
			const alert =  new Alert;
			alert.type = 'danger';
			alert.message = 'CPF inválido !!!';
			this.alerts = [];
			this.alerts.push(alert);
			return;
		}

		this.processando = true;
		this.participante.operacao = "SALVAR";
		this.service.salvar(this.participante).subscribe((resp: any) => {
			this.processando = false;
			if (resp.status.codigo != 99){
				const alert =  new Alert;
				alert.type = 'success';
				alert.message = 'Participante salvo com sucesso !!!';
				this.alerts = [];
				this.alerts.push(alert);
	
		  	}else{
				const alert =  new Alert;
				alert.type = 'danger';
				alert.message = 'Erro ao tentar salvar o Participante !!!';
				this.alerts = [];
				this.alerts.push(alert);
	
		  	}
		},
		(err) => {
			if (err.status == '403'){
				alert('Login Expirado. Por favor, realize o Login novamente !!!');
				this.authService.logout();
				return;
			}
		});		
	
	  }

	  excluir(): void {
		if (! confirm("Deseja realmente excluir este Participante ? \n \n Nome : " + this.participante.nome+ "\n\n ATENÇÂO, processo irreversível") == true) {
			return;
		}		
		this.processando = true;
		this.participante.operacao = "EXCLUIR";
		this.service.salvar(this.participante).subscribe((resp: any) => {
			this.refresh();			
			this.processando = false;
			if (resp.status.codigo != 99){
				const alert =  new Alert;
				alert.type = 'success';
				alert.message = 'Participante excluido com sucesso !!!';
				this.alerts = [];
				this.alerts.push(alert);
				this.participante = new Participante;
		  	}else{
				const alert =  new Alert;
				alert.type = 'danger';
				alert.message = 'Erro ao tentar excluir o Participante !!!';
				this.alerts = [];
				this.alerts.push(alert);
	
		  	}
		});
	
	  }
	  
	  acao(evento_id: string, operacao: string): void {
 		if (this.participante.matricula_id == ''){
			const alert =  new Alert;
			alert.type = 'danger';
			alert.message = 'Antes de confirmar a inscrição é necessário salvar os dados do participante   !!!';
			this.alerts = [];
			this.alerts.push(alert);
			return;

		}	


		if (operacao == 'CANCELAR_INSCRICAO'){
			if (! confirm("Deseja cancelar a insrição deste Participante ? \n \n Nome : " + this.participante.nome) == true) {
				return;
			}		

/**			const alert =  new Alert;
			alert.type = 'danger';
			alert.message = 'Acesso não autorizado  !!!';
			this.alerts = [];
			this.alerts.push(alert);
			return;
**/			
		}	

		
		this.processando = true;
		this.service.acao(this.participante.matricula_id, evento_id, operacao).subscribe((resp: any) => {
			//this.refresh();
			if (resp.status.codigo != 99){
				const alert =  new Alert;
				alert.type = 'success';
				if (operacao == 'CONFIRMAR_INSCRICAO'){
					this.listaEventos = resp.listaEventos;
					alert.message = 'Inscrição confirmada com sucesso !!!';
				}
				if (operacao == 'CANCELAR_INSCRICAO'){
					this.listaEventos = resp.listaEventos;
					alert.message = 'Inscrição cancelada com sucesso !!!';
				}
				if (operacao == 'RENVIAR_EMAIL'){
					alert.message = 'Comprovante de inscrição enviada para o email: ' + this.participante.email + '  !!!';
				}
				if (operacao == 'COMPROVANTE'){
					var popup = window.open(resp.url, '_blank');
					if(popup == null){
						const alert =  new Alert;
						alert.type = 'danger';
						alert.message = "Para permitir a impressão do comprovante de inscrição, é preciso ajustar as configurações do seu navegador para permitir a abertura de novas janelas deste site.";
						this.alerts = [];
						this.alerts.push(alert);
					}else{
						popup.focus();
					}					
					this.processando = false;									
					return;
				}

				this.alerts = [];
				this.alerts.push(alert);
				this.processando = false;				
		  	}else{
				this.processando = false;				
				const alert =  new Alert;
				alert.type = 'danger';
				alert.message = resp.status.mensagem;
				this.alerts = [];
				this.alerts.push(alert);
		  	}
		});
	
	  }



	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.service.sortColumn = column;
		this.service.sortDirection = direction;
	}


	pesquisar() {
		const { sortColumn, sortDirection, pageSize, page } = Funcoes.state;

		// 1. sort
		let participantes = Funcoes.sort(this.listaParticipantesOriginal, sortColumn, sortDirection);

		// 2. filter
		participantes = participantes.filter((participante) => Funcoes.matches(participante, this.searchTerm));
		const total = participantes.length;

		// 3. paginate
		participantes = participantes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

		this.listaParticipantes = participantes;
		this.total$ = total;
		
		return of({ participantes, total });
	}


	openModal(content: any, cpf : string) {

		this.participante = new Participante;				

		this.processando = false;
		this.alerts = [];
		this.checkBoxELink = false;
		this.checkBoxAtivo = true;

		this.service.getParticipante(cpf).subscribe((resp: any) => {
		  if (resp.status.codigo != 99){
			  this.participante = resp.dados;
			  this.listaEventos = resp.listaEventos;
		  }else{
			this.participante = new Participante;	
			this.listaEventos = resp.listaEventos;
		  }
		});

		const modal = this.modalService.open(content, { size: 'xl' });
		modal. result.then(() => { 

		}, () => { 

			this.refresh();			
		})
	}	

	onChange(event: any): void {
		//this.log += new Date() + "<br />";
	}

	  closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

	isValidCPF(cpf: any) {
		// Validar se é String
		if (typeof cpf !== 'string') return false
		
		// Tirar formatação
		cpf = cpf.replace(/[^\d]+/g, '')
		
		// Validar se tem tamanho 11 ou se é uma sequência de digitos repetidos
		if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false
		
		// String para Array
		cpf = cpf.split('');
		
		const validator = cpf
			// Pegar os últimos 2 digitos de validação
			.filter((digit: any, index: any, array: any) => index >= array.length - 2 && digit)
			// Transformar digitos em números
			.map( (el: string | number) => +el )
			
		const toValidate = (pop: number) => cpf
			// Pegar Array de items para validar
			.filter((digit: any, index: number, array: string | any[]) => index < array.length - pop && digit)
			// Transformar digitos em números
			.map((el: string | number) => +el)
		
		const rest = (count: number, pop: number) => (toValidate(pop)
			// Calcular Soma dos digitos e multiplicar por 10
			.reduce((soma: number, el: number, i: number) => soma + el * (count - i), 0) * 10) 
			// Pegar o resto por 11
			% 11 
			// transformar de 10 para 0
			% 10
			
		return !(rest(10,2) !== validator[0] || rest(11,1) !== validator[1])
	}

	getStatusEvento(id: String){
		if (id == ''){
			return "";
		}else if (id.indexOf("2") > -1 ||  id.indexOf("7") > -1){
			return "CONFIRMADO";
		}else if (id.indexOf("10") > -1){
				return "CONFIRMADO MANUALMENTE";
		}else{	
			return "";
		}

	}

	getTipoPagamento(id: String, status_inscricao: string){

		if (this.getStatusEvento(status_inscricao).indexOf("CONFIRMADO")  == -1){
			return "";
		}

		if (id == ''){
			return "";
		}
		if (id== '1'){
			return "Cartão de Crédito";
		}		
		if (id== '2'){
			return "Boleto Bancário";
		}	
		if (id== '4'){
			return "Cartão de Débito";
		}	
		  if (id== '5'){
			return "QR Code Crédito";
		}	
		if (id== '6'){
			return "Pix";
		}	
		if (id== '7'){
			return "QRCode Débito";
		}	
		return "";
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
 
	
}

class Alert {
	type!: string;
	message!: string;
}

export class Filtro {
	evento: string = '';
	status: string = '';
	confirmados: boolean = true;
}

class Categoria {
	id!: string;
	descricao!: string;
}