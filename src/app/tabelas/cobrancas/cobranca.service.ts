import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { AuthService } from '../../auth/auth.services';
import { Filtro, Funcoes } from '../../commons/Funcoes';
import { Service } from '../../commons/Service';
import { Cobranca } from './cobranca';


@Injectable({ providedIn: 'root' })
export class TabelaCobrancaService extends Service {

	private readonly API_CONTROLLER = Funcoes.getPathBackEnd() + '/api/tabelas/cobranca';

	constructor(private pipe: DecimalPipe, private http: HttpClient, private authService: AuthService) {
		super();
	}

	getLista(filtro: Filtro) {
		return this.http.get(this.API_CONTROLLER, this.httpOptions)
	}

	get($id: string) {
		return this.http.get(this.API_CONTROLLER + "/" + $id,  this.httpOptions)
	}

	salvar($o: any, $id: string) {
		if ($id != null){
			return this.http.put(this.API_CONTROLLER + "/" + $id, $o,  this.httpOptions)
		}else{
			return this.http.post(this.API_CONTROLLER, $o,  this.httpOptions)
		}
		
	}

	getCombos() {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_COMBOS_PROFESSORES"}, this.httpOptions)
	}	


	excluir($id: string) {
		return this.http.delete(this.API_CONTROLLER+ "/" + $id, this.httpOptions)
	}


}




