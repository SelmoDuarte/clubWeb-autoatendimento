import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, delay, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.services';
import { Funcoes } from '../../../commons/Funcoes';


@Injectable({
  providedIn: 'root'
})
export class SorteioService {

  private readonly API = Funcoes.getPathBackEnd() + '/clubWeb-api/futebol/sorteioController.php';  
  

  private httpOptions = {
		headers: new HttpHeaders({
		  'X-Requested-With': 'XMLHttpRequest',
		  'Cache-Control':	'no-cache',
		  'Authorization':	'Basic ' + this.authService.getUsuario().idToken,		  		  
		  'Content-Type': 'application/json; charset=utf-8'
		})
	};    
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getTimes() {
    return this.http.post(this.API, {}, this.httpOptions);
  }


}