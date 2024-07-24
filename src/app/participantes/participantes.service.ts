import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from './sortable.directives';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.services';
import { Participante } from './participante';
import { Evento } from '../eventos/eventos';
import { Filtro } from './participantes.component';
import { Funcoes } from '../commons/Funcoes';
import { Service } from '../commons/Service';

@Injectable({ providedIn: 'root' })
export class ParticipanteService  extends Service {

	private readonly API_CONTROLLER = Funcoes.getPathBackEnd() + '/api/participante';

	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _lista = new BehaviorSubject<Participante[]>([]);
	private _listaOriginal!: Participante[] ;
	private _total$ = new BehaviorSubject<number>(0);
	private _listaEventos =  new BehaviorSubject<Evento[]>([]);

	private _state: State = {
		page: 1,
		pageSize: 100,
		searchTerm: '',
		sortColumn: '',
		sortDirection: '',
	};

	constructor(private pipe: DecimalPipe, private http: HttpClient) {
		super();
	}

	getParticipantes(tipo: string, filtro: Filtro) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA", 'tipo': tipo, 'filtro': filtro}, this.httpOptions);

	}

	getEventos() {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_EVENTOS"}, this.httpOptions);
	}


	loadLista(tipo: string, filtro: Filtro, confirmados: string ) {

		this.getLista(tipo, filtro, confirmados).subscribe((resp: any) => {
			if (resp.status.codigo != 99){
				this._listaOriginal = resp.dados;
				this._listaEventos.next(resp.listaEventos);

				this._search$
				.pipe(
					tap(() => this._loading$.next(true)),
					debounceTime(200),
					switchMap(() => this._search()),
					delay(200),
					tap(() => this._loading$.next(false)),
				)
				.subscribe((result) => {
					this._lista.next(result.participantes);
					this._total$.next(result.total);
				});
	
			this.lista	
			this._search$.next();
	
			}
		},
		(err) => {
			console.error( err.status + " - "  + err.message);
			this._loading$.next(false);
		});
		return this._lista.asObservable();
	}


	get lista() {
		return this._lista.asObservable();
	}
	get total$() {
		return this._total$.asObservable();
	}
	get listaEventos() {
		return this._listaEventos.asObservable();
	}

	get loading$() {
		return this._loading$.asObservable();
	}
	get page() {
		return this._state.page;
	}
	get pageSize() {
		return this._state.pageSize;
	}
	get searchTerm() {
		return this._state.searchTerm;
	}

	set page(page: number) {
		this._set({ page });
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}
	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}
	set sortColumn(sortColumn: SortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}

	private _set(patch: Partial<State>) {
		Object.assign(this._state, patch);
		this._search$.next();
	}

	private _search(): Observable<SearchResult> {
		const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

		// 1. sort
		let participantes = sort(this._listaOriginal, sortColumn, sortDirection);

		// 2. filter
		participantes = participantes.filter((participante) => matches(participante, searchTerm, this.pipe));
		const total = participantes.length;

		// 3. paginate
		participantes = participantes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
		return of({ participantes, total });
	}

	private search() {
		const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

		// 1. sort
		let participantes = sort(this._listaOriginal, sortColumn, sortDirection);

		// 2. filter
		participantes = participantes.filter((participante) => matches(participante, searchTerm, this.pipe));
		const total = participantes.length;

		// 3. paginate
		participantes = participantes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
		
		return of({ participantes, total });
	}


	private getLista(tipo: string, filtro: Filtro, confirmados: string) {
		return this.http.post(this.API_CONTROLLER, {"operacao": "GET_LISTA", 'tipo': tipo, 'filtro': filtro, 'confirmados': confirmados}, this.httpOptions);
	}

	getParticipante(cpf: any) {
   		return this.http.post(this.API_CONTROLLER, {"cpf" : cpf, "operacao": "GET"} , this.httpOptions);
	}

  salvar(participante: Participante) {
		return this.http.post(this.API_CONTROLLER, participante, this.httpOptions);
  }

  acao(matricula_id: string, evento_id: string, operacao: string) {
	return this.http.post(this.API_CONTROLLER, {'matricula_id': matricula_id, 'evento_id': evento_id, 'operacao': operacao}, this.httpOptions);
  }


}

interface SearchResult {
	participantes: Participante[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(participantes: Participante[], column: SortColumn, direction: string): Participante[] {
	if (direction === '' || column === '') {
		return participantes;
	} else {
		return [...participantes].sort((a, b) => {
			const res = compare(a[column], b[column]);
			return direction === 'asc' ? res : -res;
		});
	}
}

function matches(participante: Participante, term: string, pipe: PipeTransform) {
	return (
		participante.matricula_id.toLowerCase().includes(term.toLowerCase()) ||
		participante.nome.toLowerCase().includes(term.toLowerCase()) ||
		participante.email.toLowerCase().includes(term.toLowerCase()) 		
	);
}
