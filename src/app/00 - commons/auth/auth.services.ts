import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { Funcoes } from '../Funcoes';
import { md5 } from 'js-md5';


@Injectable({ providedIn: 'root' })
export class AuthService {

	private readonly API_LOG_ERRO_NO_AUTHENTICATE = Funcoes.getPathBackEnd() + '/api/erro_no_authenticate';
	private readonly API_LOG_ERRO = Funcoes.getPathBackEnd() + '/api/erro';

	private readonly API_LOGIN_CONTROLLER = Funcoes.getPathBackEnd() + '/api/login';
  private readonly API_REFRESH_TOKEN = Funcoes.getPathBackEnd() + '/api/refreshToken';
	private readonly API_CHANGE_PASSWORD = Funcoes.getPathBackEnd() + '/api/changePassword';  

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private usuario = {};

	constructor(private router: Router, private http: HttpClient) {}

	private httpOptions = {
		headers: new HttpHeaders({})
	};

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }  

  getUsuario() {
    return this.usuario;
  }

  login(usuario: any) {
      this.loggedIn.next(true);
      this.router.navigate(['/home']);
      this.usuario = usuario;
  }

  logout() {
    this.usuario = {};
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    var httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control':	'no-cache',
        'Authorization':	'Bearer ' + Funcoes.getUsuarioLogado().token,		  		  
        'Content-Type': 'application/json; charset=utf-8'
      })
    };  
		return this.http.post(this.API_REFRESH_TOKEN, {}, httpOptions)
	}	


  verificaAcesso(usuario: any) {
    
    this.httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control':	'no-cache',
        'Authorization':	'Basic ' + usuario.userName + "|" + md5(usuario.password),		  		  
        'Content-Type': 'application/json; charset=utf-8'
      })
    };

    return this.http.post(this.API_LOGIN_CONTROLLER, {'tipo': '1'}, this.httpOptions);

  }

  alterarSenha(usuario: any, senhaNova: string) {
    
    this.httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control':	'no-cache',
        'Authorization':	'Basic ' + usuario.userName + "|" + md5(usuario.password),		  		  
        'Content-Type': 'application/json; charset=utf-8'
      })
    };

    return this.http.post(this.API_CHANGE_PASSWORD, {'p': md5(senhaNova)}, this.httpOptions);

  }  

  logErrorService(e: any) {
		console.log(Funcoes.getUsuarioLogado());
		e.idusuario = Funcoes.getUsuarioLogado().id;
    e.auth= 'N';
    return this.http.post(this.API_LOG_ERRO_NO_AUTHENTICATE, {"operacao": "SALVAR", "erro": e }, this.httpOptions)
	}	

}