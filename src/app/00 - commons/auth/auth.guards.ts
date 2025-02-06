import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAcessoNegadoComponent } from './modal-acessoNegado/modal-acessoNegado.component';
import { Funcoes } from '../commons/Funcoes';


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

        if (meusAcessos.indexOf('ADMIN') >= 0 ){
          return true;
        }

        var url_acesso = (url[url.length-1] == undefined ? url: url[url.length-1]);

        if (url_acesso == 'RESUMO-CAIXA'){
            
            var perfis = ['SETOR-SECRETARIA', 'SETOR-ESPORTE', 'SETOR-ACADEMIA'];
            
            if (! Funcoes.verificaAcesso(perfis, false)){
                var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
                modalRef.componentInstance.papel = perfis;
                setTimeout(() => modalRef.close({}), 2000);      
                return false;
            }else{
              return true;
            }
        }

        if (url_acesso == 'CONCESSIONARIOS'){
            
          var perfis = ['SETOR-SECRETARIA', 'CONCESSIONARIO-MANUTENCAO'];
          
          if (! Funcoes.verificaAcesso(perfis, false)){
              var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
              modalRef.componentInstance.papel = perfis;
              setTimeout(() => modalRef.close({}), 2000);      
              return false;
          }else{
            return true;
          }
      }

      if (url_acesso == 'FUNCIONARIOS'){
            
        var perfis = ['SETOR-SECRETARIA', 'FUNCIONARIO-MANUTENCAO'];
        
        if (! Funcoes.verificaAcesso(perfis, false)){
            var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
            modalRef.componentInstance.papel = perfis;
            setTimeout(() => modalRef.close({}), 2000);      
            return false;
        }else{
          return true;
        }
      }
      if (url_acesso == 'MATRICULADOS'){
            
        var perfis = ['SETOR-SECRETARIA', 'SETOR-ESPORTE', 'SETOR-ACADEMIA'];
        
        if (! Funcoes.verificaAcesso(perfis, false)){
            var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
            modalRef.componentInstance.papel = perfis;
            setTimeout(() => modalRef.close({}), 2000);      
            return false;
        }else{
          return true;
        }
      }      


        if (meusAcessos.indexOf(url_acesso) >= 0 ){
            possuiAcesso = true;
        }
        
        console.log(url_acesso);

    
        if (! possuiAcesso ){
            var modalRef = this.modalService.open(ModalAcessoNegadoComponent);
            var aa =[];
            aa.push(url_acesso);

            modalRef.componentInstance.papel = aa ;
            return false;
  
        }

        return true;
      })
    );
}
}