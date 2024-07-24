import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.services';
import { Filtro, Funcoes } from '../../commons/Funcoes';
import { Professor } from '../professores/professor';


@Injectable({ providedIn: 'root' })
export class TurmaService {

	private readonly API_CONTROLLER = Funcoes.getPathBackEnd() + '/clubWeb-api/ascclub/turmaController.php';

	constructor(private pipe: DecimalPipe, private http: HttpClient, private authService: AuthService) {}

	private httpOptions = {
		headers: new HttpHeaders({
		  'X-Requested-With': 'XMLHttpRequest',
		  'Cache-Control':	'no-cache',
		  'Authorization':	'Basic ' + this.authService.getUsuario().idToken,		  		  
		  'Content-Type': 'application/json; charset=utf-8'
		})
	};

	getLista(filtro: Filtro) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA", 'filtro': filtro}, this.httpOptions)
	}

	get(filtro: Filtro) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET", 'filtro': filtro}, this.httpOptions)
	}

	getCombos() {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_COMBOS_TURMA"}, this.httpOptions)
	}	

	getDetalhes(id: string) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_DETALHES", "id": id }, this.httpOptions)
	}


	professorIncluir(o: any, p: Professor) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "PROFESSOR_INCLUIR", 'o': o, 'professor': p}, this.httpOptions)
	}

	professorExcluir(o: any, p: Professor) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "PROFESSOR_EXCLUIR", 'o': o, 'professor': p}, this.httpOptions)
	}

	professorDefinirPrincipal(o: any, p: Professor) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "PROFESSOR_PRINCIPAL", 'o': o, 'professor': p}, this.httpOptions)
	}

	salvar(o: any) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "SALVAR", 'o': o}, this.httpOptions)
	}

	excluir(o: any) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "EXCLUIR", 'o': o}, this.httpOptions)
	}

	getCategorias(id: string) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA_CATEGORIAS", "id": id}, this.httpOptions)
	}

}




