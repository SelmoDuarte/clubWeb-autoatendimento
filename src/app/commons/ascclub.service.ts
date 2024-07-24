import { Injectable} from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.services';
import { Filtro, Funcoes } from './Funcoes';

@Injectable({ providedIn: 'root' })
export class AscClubService {

	private readonly API_FINANCEIRO = Funcoes.getPathBackEnd() + '/clubWeb-api/ascclub/financeiroController.php';
	private readonly API_RELATORIOS = Funcoes.getPathBackEnd() + '/api/relatorios/atividade';

	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();


	constructor(private pipe: DecimalPipe, private http: HttpClient, private authService: AuthService) {}

	private httpOptions = {
		headers: new HttpHeaders({
		  'X-Requested-With': 'XMLHttpRequest',
		  'Cache-Control':	'no-cache',
		  'Authorization':	'Basic ' + this.authService.getUsuario().idToken,		  		  
		  'Content-Type': 'application/json; charset=utf-8'
		})
	};


	getTiposCobranca() {
		return this.http.post(this.API_FINANCEIRO, {"operacao": "GET_LISTA_TIPOS_COBRANCA"}, this.httpOptions)
	}

	getCategorias(id: string) {
		return this.http.post(this.API_FINANCEIRO, {"operacao": "GET_LISTA_CATEGORIAS", "id": id}, this.httpOptions)
	}

/** ###############     RELATORIO        ###################### */


	getAtividadesCursos() {
		return this.http.post(this.API_RELATORIOS, {"operacao": "GET_ATIVIDADES_CURSO"}, this.httpOptions)
	}

	getTurmasAtividadeCursos(id: string) {
		return this.http.post(this.API_RELATORIOS, {"operacao": "GET_TURMAS_ATIVIDADE_CURSO", "id": id}, this.httpOptions)
	}


	relatorioAtividades(filtro: Filtro) {
		return this.http.post(this.API_RELATORIOS, {"operacao": "RELATORIO_ATIVIDADES", "filtro": filtro}, this.httpOptions)
	}

/** ###############     FIM RELATORIO        ###################### */	

}
