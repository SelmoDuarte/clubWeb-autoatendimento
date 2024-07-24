import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.services";
import { Funcoes } from "./Funcoes";
import { DecimalPipe } from "@angular/common";

@Injectable({ providedIn: 'root' })
export class Service {

	httpOptions = {
		headers: new HttpHeaders({
		  'X-Requested-With': 'XMLHttpRequest',
		  'Cache-Control':	'no-cache',
		  'Authorization':	'Bearer ' + Funcoes.getUsuarioLogado().token,		  		  
		  'Content-Type': 'application/json; charset=utf-8'
		})
	};

}
