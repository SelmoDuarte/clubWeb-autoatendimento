import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AssociadosService } from './associados.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Alert } from '../compra-manual/Funcoes';
import { Associado } from './associado';
import { ModalAssociadoComponent } from './modal-associado/modal-associado.component';
import { Filtro, Funcoes, Resposta } from '../commons/Funcoes';


@Component({
  selector: 'app-associados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    HttpClientModule,
],

  templateUrl: './associados.component.html',
  styleUrl: './associados.component.css',
  providers: [provideNgxMask(), AssociadosService, DecimalPipe ],    	   

})
export class AssociadosComponent implements OnInit {
 
  @ViewChild("campoPesquisa") campoPesquisa : ElementRef;
	@ViewChild("checkBox_filtro_somenteAtivos") checkBox_filtro_somenteAtivos : ElementRef;  	  

  constructor(
    private service: AssociadosService,
    private modalService: NgbModal,
  ) {}

  listaCategorias = [];
  listaAssociados = [];
  listaSituacoes = [];
  listaCidades = [];  
  listaEstadosCivil = [];  
  listaEscolaridades = [];    
  listaProfissoes = [];      
  listaLayoutsBoletos = [];
  listaParentescos = [];
  listaTipoPesquisa = ['Num. Titulo','Matricula', "Nome", "CPF"];
  associado = new Associado;
  filtro = new Filtro;
  modoLeitura = true;
	processando = false;   
  mascaraPesquisa = "000000" ; 

  alerts: Alert[] = [];


  ngOnInit(): void {
 
    this.filtro.tipo = this.listaTipoPesquisa[0];    
    this.filtro.socios = 'S';
    this.filtro.somenteAtivos = 'S';

  }

  ngAfterViewInit() {
    this.campoPesquisa.nativeElement.focus();
  }


  pesquisar(){

		if (this.checkBox_filtro_somenteAtivos == undefined  || this.checkBox_filtro_somenteAtivos.nativeElement.checked){
			this.filtro.somenteAtivos = 'S';
		  }else{
			this.filtro.somenteAtivos = 'N';        
		}


    this.processando = true;
    this.service.getAssociados(this.filtro).subscribe(
      (resp: Resposta) => {
        this.processando = false;
        if (resp.status.codigo == 0){
          if (resp.dados.length == 1){
            this.openModal(resp.dados[0]);
          }else{
            this.listaAssociados = resp.dados;
          }
        }else{
          this.associado = new Associado;
          const alert =  new Alert;
          alert.type = 'danger';
          alert.message = resp.status.mensagem;
          this.alerts.push(alert);
        }
      },
      (e: any) => {                              //Error callback
        console.error(e.error.status.mensagem);
        const alert =  new Alert;
        alert.type = 'danger';
        alert.message = e.error.status.mensagem;
        this.alerts.push(alert);

        this.processando = false;
      }
    );
    this.campoPesquisa.nativeElement.focus();    
  }

  openModal(associado : Associado) {

		this.alerts = [];
		const modal = this.modalService.open(ModalAssociadoComponent, { size: 'xl' });

    modal.componentInstance.id =associado.idassociado;            
    
		modal. result.then(() => { 
		}, () => { 

		})
	}

  atualizarTipoPesquisa(){
    if(this.filtro.tipo == 'Nome'){
      this.mascaraPesquisa = "";
      const campo: HTMLInputElement = < HTMLInputElement > (document.getElementById("campoPesquisa"));   
      campo.style.width= "500px" ;  
    }

    if(this.filtro.tipo == 'Num. Titulo'){
      this.mascaraPesquisa = "000000";
      const campo: HTMLInputElement = < HTMLInputElement > (document.getElementById("campoPesquisa"));   
      campo.style.width= "100px" ;  
    }

    if(this.filtro.tipo == 'Matricula'){
      this.mascaraPesquisa = "0000000000";
      const campo: HTMLInputElement = < HTMLInputElement > (document.getElementById("campoPesquisa"));   
      campo.style.width= "150px" ;  
    }

    if(this.filtro.tipo == 'CPF'){
      this.mascaraPesquisa = "000.000.000-00";
      const campo: HTMLInputElement = < HTMLInputElement > (document.getElementById("campoPesquisa"));   
      campo.style.width= "200px" ;  
    }


  }
  
	closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}


}
