import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { Funcoes } from '../commons/Funcoes';
import { Usuario } from './usuario';
import { md5 } from 'js-md5';


@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly API_LOGIN_CONTROLLER = Funcoes.getPathBackEnd() + '/api/login';
	private readonly API_CHANGE_PASSWORD = Funcoes.getPathBackEnd() + '/api/changePassword';  

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private usuario: Usuario;

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

  login(usuario: Usuario) {
      this.loggedIn.next(true);
      this.router.navigate(['/home']);
      this.usuario = usuario;
  }

  logout() {
    this.usuario = null;
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  verificaAcesso(usuario: Usuario) {
    
    this.httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control':	'no-cache',
        'Authorization':	'Basic ' + usuario.userName + "|" + md5(usuario.password),		  		  
        'Content-Type': 'application/json; charset=utf-8'
      })
    };

    return this.http.post(this.API_LOGIN_CONTROLLER, {'tipo': '0'}, this.httpOptions);

  }

  alterarSenha(usuario: Usuario, senhaNova: string) {
    
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
}