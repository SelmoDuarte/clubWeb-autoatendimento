import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, delay, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Ingresso, Pessoa } from './pessoa';
import { TipoIngresso } from './Funcoes';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../auth/auth.services';
import { Funcoes } from '../commons/Funcoes';


@Injectable({
  providedIn: 'root'
})
export class CompraManualService {

  private readonly API_COMPRA_MANUAL = Funcoes.getPathBackEnd() + '/clubWeb-api/compra-manual/compraManualController.php';  
  private readonly API_EVENTOS = Funcoes.getPathBackEnd() + '/clubWeb-api//eventos/eventoController.php';    
  
	private httpOptions = {
		headers: new HttpHeaders({
		  'X-Requested-With': 'XMLHttpRequest',
		  'Cache-Control':	'no-cache',
		  'Authorization':	'Basic ' + this.authService.getUsuario().idToken,		  		  
		  'Content-Type': 'application/json; charset=utf-8'
		})
	};
    
  constructor(private pipe: DecimalPipe, private http: HttpClient, private authService: AuthService) {}


  getListaEvento(eventos_id: string) {

    return this.http.post(this.API_EVENTOS, {operacao: 'GET_LISTA_COMPRA_MANUAL', 'ids': eventos_id}, this.httpOptions);
  }



  compra_manual(cielo_id: string, pessoa: Pessoa, listaIngressos: Ingresso[], listaTiposIngresso : TipoIngresso[], token:string){

    return this.http.post(this.API_COMPRA_MANUAL, {operacao: 'COMPRA_MANUAL', 'listaIngressos': listaIngressos}, this.httpOptions);


  }



  



}