import { Injectable} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../../commons/Service';
import { Filtro, Funcoes } from '../../../commons/Funcoes';

@Injectable({ providedIn: 'root' })
export class RelatorioAssociadosConvenioService extends Service {

	constructor( private pipe: DecimalPipe,  private http: HttpClient) {
		super();
	}

	private readonly API_RELATORIOS = Funcoes.getPathBackEnd() + '/api/relatorios/associados/convenio';

	getConvenios() {
		return this.http.post(this.API_RELATORIOS, {"operacao": "GET_LISTA_CONVENIOS"}, this.httpOptions)
	}

	relatorioConvenios(filtro: Filtro) {
		return this.http.post(this.API_RELATORIOS, {"operacao": "RELATORIO_CONVENIOS", "filtro": filtro}, this.httpOptions)
	}

}
