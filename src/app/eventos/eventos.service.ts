import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from './sortable.directives';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Evento } from './eventos';
import { Funcoes, Resposta } from '../commons/Funcoes';
import { Service } from '../commons/Service';

@Injectable({ providedIn: 'root' })
export class EventoService extends Service {

	private readonly API_BANNER_CONTROLLER = Funcoes.getPathBackEnd() + '/api/evento';

	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _lista = new BehaviorSubject<Evento[]>([]);
	private _listaOriginal!: Evento[] ;
	private _total$ = new BehaviorSubject<number>(0);

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

	loadLista(tipo: string ) {

		this.getLista(tipo).subscribe((resp: Resposta) => {
			if (resp.status.codigo != 99){
				this._listaOriginal = resp.dados;

				this._search$
				.pipe(
					tap(() => this._loading$.next(true)),
					debounceTime(200),
					switchMap(() => this._search()),
					delay(200),
					tap(() => this._loading$.next(false)),
				)
				.subscribe((result) => {
					this._lista.next(result.eventos);
					this._total$.next(result.total);
				});
	
			this._search$.next();
	
			}
		},
		(err) => {
			if (err.status == '403'){
				alert('Login Expirado. Por favor, realize o Login novamente !!!');
				return;
			}
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
		let eventos = sort(this._listaOriginal, sortColumn, sortDirection);

		// 2. filter
		eventos = eventos.filter((evento) => matches(evento, searchTerm, this.pipe));
		const total = eventos.length;

		// 3. paginate
		eventos = eventos.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
		return of({ eventos, total });
	}

	private getLista(tipo: string) {
   
		return this.http.post(this.API_BANNER_CONTROLLER, {"operacao": "GET_LISTA", 'tipo': tipo}, this.httpOptions);
	
	  }

	getEvento(id: any) {
   
		return this.http.post(this.API_BANNER_CONTROLLER, {"id" : id, "operacao": "GET"} , this.httpOptions);
	
	  }

  salvar(evento: Evento) {
   
    return this.http.post(this.API_BANNER_CONTROLLER, evento, this.httpOptions);

  }

  getTiposCobranca() {
	return this.http.post(this.API_BANNER_CONTROLLER, {"operacao": "GET_LISTA_TIPOS_COBRANCA"}, this.httpOptions)
}

getCategorias(id: string) {
	return this.http.post(this.API_BANNER_CONTROLLER, {"operacao": "GET_LISTA_CATEGORIAS", "id": id}, this.httpOptions)
}



}

interface SearchResult {
	eventos: Evento[];
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

function sort(eventos: Evento[], column: SortColumn, direction: string): Evento[] {
	if (direction === '' || column === '') {
		return eventos;
	} else {
		return [...eventos].sort((a, b) => {
			const res = compare(a[column], b[column]);
			return direction === 'asc' ? res : -res;
		});
	}
}

function matches(evento: Evento, term: string, pipe: PipeTransform) {
	return (
		evento.nome.toLowerCase().includes(term.toLowerCase()) 
	);
}