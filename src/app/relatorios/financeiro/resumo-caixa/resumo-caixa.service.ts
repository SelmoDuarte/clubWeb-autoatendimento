import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Filtro, Funcoes } from '../../../commons/Funcoes';
import { AuthService } from '../../../auth/auth.services';
import { Registro } from './registro';
import { Service } from '../../../commons/Service';


@Injectable({ providedIn: 'root' })
export class RelatorioFinanceiroResumoCaixaService extends Service {

	private readonly API_CONTROLLER = Funcoes.getPathBackEnd() + '/api/relatorios/financeiro/resumo-caixa';

	constructor(private pipe: DecimalPipe, private http: HttpClient) {
		super()
	}

	getLista(filtro: Filtro) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA", 'filtro': filtro}, this.httpOptions)
	}

	get(filtro: Filtro) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET", 'filtro': filtro}, this.httpOptions)
	}

	getCombos() {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_COMBOS_RELATORIO_FINANCEIRO_RESUMO_CAIXA"}, this.httpOptions)
	}	

	formatarJSONSinteitco(lista: Registro[]) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "FORMAT_JSON_SINTETICO", 'lista': lista}, this.httpOptions)
	}


}




