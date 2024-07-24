import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.services';
import { GoogleApiService } from '../login/google-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAcessoNegadoComponent } from './modal-acessoNegado/modal-acessoNegado.component';


@Injectable({
    providedIn: 'root', // <---- Adiciona isto ao serviço
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return false;
        }

        var a = state.url
        a = a.toUpperCase();

        var url = a.split('/');

        const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
        var meusAcessos = jsonUsuario.acessos;   
        meusAcessos = meusAcessos.toUpperCase();
        
        var possuiAcesso = false;

        if (meusAcessos.indexOf(url[1]) >= 0 ){
            possuiAcesso = true;
        }
    
        if (! possuiAcesso ){
            var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
            var aa =[];
            aa.push(url[1]);

            modalRef.componentInstance.papel = aa ;
            return false;
  
        }

        return true;
      })
    );
}
}