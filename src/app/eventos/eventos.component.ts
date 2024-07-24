import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { NgbAlertModule, NgbHighlight, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader, SortEvent } from './sortable.directives';
import { Observable } from 'rxjs';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { FileItem, FileUploadModule, FileUploader, ParsedResponseHeaders, } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.services';
import { EventoService } from './eventos.service';
import { Evento } from './eventos';
import * as XLSX from 'xlsx'; 
import { FormsModule } from '@angular/forms';
import { AscClubService } from '../commons/ascclub.service';
import { Funcoes, Resposta } from '../commons/Funcoes';

@Component({
	selector: 'app-eventos',
	standalone: true,
	imports: [CommonModule, DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule, CKEditorModule, FileUploadModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe, NgbAlertModule ],
	templateUrl: './eventos.component.html',
	styleUrl: './eventos.component.css',  
	providers: [EventoService, DecimalPipe, provideNgxMask()],
})

export class EventosComponent implements OnInit{

	private readonly API_UPLOAD = Funcoes.getPathBackEnd() + '/clubWeb-api/uploadFile.php';	

	evento : Evento = new Evento;
	listaEventos!: Observable<Evento[]>;
	total$!: Observable<number>;
	alerts: Alert[] = [];
	filtroSelecionado: Filtro[] = [];	
	numTotalRegistros: number = 0; 	
	checkBoxStatus: boolean = false;
	checkBoxPermitirInadimplente: boolean = false;
	listaTipoCobranca = [];
	listaTipoCategoria = [];

	tipo: any = null;

	uploader!: FileUploader;

	modoLeitura = false;	
	processando = false;
	desativarBotaoSalvar = false;

	@ViewChildren(NgbdSortableHeader)  headers!: QueryList<NgbdSortableHeader>;

	constructor(public service: EventoService, private modalService: NgbModal,private router: ActivatedRoute, private authService: AuthService) {

		this.refresh();


		this.uploader = new FileUploader({
			url: this.API_UPLOAD,
			disableMultipart: false,
			autoUpload: true,
			method: "post",
			itemAlias: "attachment",
			allowedFileType: ["image", "pdf"],
		  });
	  
		  this.uploader.onErrorItem = (item, response, status, headers) =>
			this.onErrorItem(item, response, status, headers);
		  this.uploader.onSuccessItem = (item, response, status, headers) =>
			this.onSuccessItem(item, response, status, headers);



	}
	ngOnInit(): void {

		this.processando = false;			

	}

	refresh(){
		this.listaEventos = this.service.loadLista("" + this.router.snapshot.paramMap.get("tipo"));
		this.total$ = this.service.total$;		
		this.total$.subscribe(result => {this.numTotalRegistros = result});	
	}


	salvar(): void {

		this.alerts = [];

		if(this.checkBoxStatus==true){
			this.evento.status = 'Ativo';
		}else{
			this.evento.status = 'Desativado';
		}		


		this.processando = true;
		this.evento.operacao = "SALVAR";
		this.service.salvar(this.evento).subscribe((resp: Resposta) => {
			this.processando = false;
			if (resp.status.codigo != 99){
				this.evento.id = resp.dados.id;
				const alert =  new Alert;
				alert.type = 'success';
				alert.message = 'Evento salvo com sucesso !!!';
				this.alerts.push(alert);
		  	}else{
				const alert =  new Alert;
				alert.type = 'danger';
				alert.message = 'Erro ao tentar salvar o Evento !!!';
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
		if (! confirm("Deseja realmente excluir este Evento ? \n \n Descrição : " + this.evento.nome+ "\n\n ATENÇÂO, processo irreversível") == true) {
			return;
		}		
		this.processando = true;
		this.evento.operacao = "EXCLUIR";
		this.service.salvar(this.evento).subscribe((resp: Resposta) => {
			this.refresh();			
			this.processando = false;
			if (resp.status.codigo != 99){
				const alert =  new Alert;
				alert.type = 'success';
				alert.message = 'Evento excluido com sucesso !!!';
				this.alerts.push(alert);
				this.evento = new Evento;
		  	}else{
				const alert =  new Alert;
				alert.type = 'danger';
				alert.message = resp.status.mensagem;
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

	openModal(content: any, id : string) {

		this.evento = new Evento;				

		this.processando = false;
		this.alerts = [];
		this.checkBoxStatus = false;


		this.service.getTiposCobranca().subscribe((resp: Resposta)  => {
			this.listaTipoCobranca = resp.dados;

			this.service.getEvento(id).subscribe((resp: Resposta) => {
				if (resp.status.codigo != 98){
		  
				  this.evento = resp.dados;
				  var categoria = resp.dados.categoria;
				  this.service.getCategorias(this.evento.tipo_cobranca).subscribe((resp: Resposta)  => {
					  this.listaTipoCategoria = resp.dados;
					  this.evento.categoria = categoria;
				  });			
				  if (this.evento.status == 'Ativo'){
					  this.checkBoxStatus = true;
				  }else{
					  this.checkBoxStatus = false;
				  }
	  
				}else{
				  this.evento = new Evento;	
				}
			  });
	  
			
		});


		const modal = this.modalService.open(content, { size: 'xl' });
		modal. result.then(() => { 

		}, () => { 
			this.refresh();			

		})
	}


	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

	onSuccessItem(
		item: FileItem,
		response: string,
		status: number,
		headers: ParsedResponseHeaders
	  ): any {
		let data = JSON.parse(response); //success server response
		if (data.status.codigo !== 0) {
		  const alert =  new Alert;
		  alert.type = 'danger';
		  alert.message = data.status.mensagem;
		  this.alerts.push(alert);
		  this.desativarBotaoSalvar = true;
		} else {
		  this.evento.banner = data.status.fileName;
		  this.desativarBotaoSalvar = false;
		}
	  }
	
	  onErrorItem(
		item: FileItem,
		response: string,
		status: number,
		headers: ParsedResponseHeaders
	  ): any {
		let error = JSON.parse(response); //error server response
		alert("ERRO ao  realizar o UPLOAD do Arquivo. Tente novamente");
	  }

	  exportexcel(): void {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, 'eventos.xlsx');
			
    }

	atualizarListaCategorias(){
		this.service.getCategorias(this.evento.tipo_cobranca).subscribe((resp: Resposta)  => {
			this.listaTipoCategoria = resp.dados;
		});
	}

	atualizarValor(){
		for (var i = 0; i < this.listaTipoCategoria.length; i++) {
            var t = this.listaTipoCategoria[i];
			if (t.id == this.evento.categoria){
				this.evento.valor_socio = Number(t.valor);
			}
		}	
	}

}

class Alert {
	type!: string;
	message!: string;
}

class Filtro {
	campo!: string;
	valor!: string;
}

class Categoria {
	id!: string;
	descricao!: string;
}

function validaData (valor: string) {
	// Verifica se a entrada é uma string
	if (typeof valor !== 'string') {
	  return false
	}
  
	// Verifica formado da data
	if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
	  return false
	}
  
	// Divide a data para o objeto "data"
	const partesData = valor.split('/')
	const data = { 
	  dia: partesData[0], 
	  mes: partesData[1], 
	  ano: partesData[2] 
	}
	
	// Converte strings em número
	const dia = parseInt(data.dia)
	const mes = parseInt(data.mes)
	const ano = parseInt(data.ano)
	
	// Dias de cada mês, incluindo ajuste para ano bissexto
	const diasNoMes = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
  
	// Atualiza os dias do mês de fevereiro para ano bisexto
	if (ano % 400 === 0 || ano % 4 === 0 && ano % 100 !== 0) {
	  diasNoMes[2] = 29
	}
	
	// Regras de validação:
	// Mês deve estar entre 1 e 12, e o dia deve ser maior que zero
	if (mes < 1 || mes > 12 || dia < 1) {
	  return false
	}
	// Valida número de dias do mês
	else if (dia > diasNoMes[mes]) {
	  return false
	}
	
	// Passou nas validações
	return true
  }