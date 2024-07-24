import { Injectable } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.services';
import { Funcoes } from '../commons/Funcoes';
import { Service } from '../commons/Service';

@Injectable({ providedIn: 'root' })
export class DependentesService extends Service {

	private readonly API_CONTROLLER = Funcoes.getPathBackEnd() + '/api/dependente';

	constructor(private pipe: DecimalPipe, private http: HttpClient, private authService: AuthService) {
		super()
	}

	getDependentes(filtro: any) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_DEPENDENTE", "filtro": filtro }, this.httpOptions)
	}

	getCombosDependente() {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_COMBOS_DEPENDENTE" }, this.httpOptions)
	}
	
	getDependenteDetalhes(dependente_id: string) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_DEPENDENTE_DETALHE", "dependente_id": dependente_id }, this.httpOptions)
	}


}
