import { Injectable } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Funcoes } from '../commons/Funcoes';
import { Service } from '../commons/Service';
import { Associado } from './associado';

@Injectable({ providedIn: 'root' })
export class AssociadosService extends Service {

	constructor( private pipe: DecimalPipe,  private http: HttpClient) {
		super();
	}

	private readonly API_ASSOCIADO = Funcoes.getPathBackEnd() + '/api/associados';

	getAssociadosCombos() {
		return this.http.post(this.API_ASSOCIADO, {"operacao": "GET_COMBOS_ASSOCIADOS"}, this.httpOptions)
	}	

	getAssociados(filtro: any) {
		return this.http.post(this.API_ASSOCIADO, {"operacao": "GET_LISTA", "filtro": filtro }, this.httpOptions)
	}

	getAssociadoByID(id: string) {
		return this.http.post(this.API_ASSOCIADO, {"operacao": "GET_ASSOCIADO", "filtro": {'tipo': 'ASSOCIADO_ID', 'valor': id , 'somenteAtivos': ''}}, this.httpOptions)
	}

	getAssociadoDetalhes(socio_id: string) {
		return this.http.post(this.API_ASSOCIADO, {"operacao": "GET_ASSOCIADO_DETALHE", "socio_id": socio_id }, this.httpOptions)
	}	

	salvar(a: Associado) {
		return this.http.post(this.API_ASSOCIADO, {"operacao": "SALVAR", "a": a }, this.httpOptions)
	}	

}