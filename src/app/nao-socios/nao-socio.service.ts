import { Injectable } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.services';
import { Funcoes } from '../commons/Funcoes';

@Injectable({ providedIn: 'root' })
export class NaoSocioService {

	private readonly API_CONTROLLER = Funcoes.getPathBackEnd() + '/clubWeb-api/ascclub/naoSocioController.php';

	constructor(private pipe: DecimalPipe, private http: HttpClient, private authService: AuthService) {}

	private httpOptions = {
		headers: new HttpHeaders({
		  'X-Requested-With': 'XMLHttpRequest',
		  'Cache-Control':	'no-cache',
		  'Authorization':	'Basic ' + this.authService.getUsuario().idToken,		  		  
		  'Content-Type': 'application/json; charset=utf-8'
		})
	};

	getNaoSocio(filtro: any) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_NAO_SOCIO", "filtro": filtro }, this.httpOptions)
	}

	getCombosNaoSocio() {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_COMBOS_NAO_SOCIO" }, this.httpOptions)
	}

}
