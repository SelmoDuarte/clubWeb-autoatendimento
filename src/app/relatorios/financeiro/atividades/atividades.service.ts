import { Injectable} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../../commons/Service';
import { Filtro, Funcoes } from '../../../commons/Funcoes';

@Injectable({ providedIn: 'root' })
export class RelatorioFinanceiroAtividadesService extends Service {

	constructor( private pipe: DecimalPipe,  private http: HttpClient) {
		super();
	}

	private readonly API_RELATORIOS = Funcoes.getPathBackEnd() + '/api/relatorios/financeiro/atividade';

	getTiposCobranca() {
		return this.http.post(this.API_RELATORIOS, {"operacao": "GET_LISTA_TIPOS_COBRANCA"}, this.httpOptions)
	}

	getCategorias(id: string) {
		return this.http.post(this.API_RELATORIOS, {"operacao": "GET_LISTA_CATEGORIAS", "id": id}, this.httpOptions)
	}

	getAtividadesCursos() {
		return this.http.post(this.API_RELATORIOS, {"operacao": "GET_ATIVIDADES_CURSO"}, this.httpOptions)
	}

	getTurmasAtividadeCursos(id: string) {
		return this.http.post(this.API_RELATORIOS, {"operacao": "GET_TURMAS_ATIVIDADE_CURSO", "id": id}, this.httpOptions)
	}

	relatorioAtividades(filtro: Filtro) {
		return this.http.post(this.API_RELATORIOS, {"operacao": "RELATORIO_ATIVIDADES", "filtro": filtro}, this.httpOptions)
	}

}
