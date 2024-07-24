import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.services';
import { Filtro, Funcoes } from '../../commons/Funcoes';
import { Service } from '../../commons/Service';


@Injectable({ providedIn: 'root' })
export class BaixaColetivaAtividadeService  extends Service{

	private readonly API_CONTROLLER = Funcoes.getPathBackEnd() + '/api/financeiro/baixa/lote';

	constructor(private pipe: DecimalPipe, private http: HttpClient, private authService: AuthService) {
		super();
	}

	getLista(filtro: Filtro) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA", 'filtro': filtro}, this.httpOptions)
	}

	get(filtro: Filtro) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET", 'filtro': filtro}, this.httpOptions)
	}

	getCombos() {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_COMBOS_BAIXA_COLETIVA_ATIVIDADES"}, this.httpOptions)
	}	

	getDetalhes(id: string) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_DETALHES", "id": id }, this.httpOptions)
	}

	getListaAlunos(ano_mes: string, idcategoria: string) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA_ALUNOS", "ano_mes": ano_mes, "idcategoria": idcategoria }, this.httpOptions)
	}


	salvar(lista: any, o: any) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "SALVAR", 'lista': lista ,'o': o}, this.httpOptions)
	}

	getCategorias(id: string) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA_CATEGORIAS", "id": id}, this.httpOptions)
	}

	getListaRelatorio(filtro: Filtro) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA_RELATORIO", "filtro": filtro}, this.httpOptions)
	}
	
}