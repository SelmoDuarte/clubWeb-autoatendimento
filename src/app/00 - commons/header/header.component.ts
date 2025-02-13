import { AfterViewInit, Component, OnInit, Optional } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.services';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Funcoes } from '../Funcoes';
import { ModalTokenTimerComponent } from '../modal-token-timer/modal-token-timer.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, AfterViewInit{

  isLoggedIn$!: Observable<boolean>;
  title: string = "Inscrições > Andamento";
  usuario:any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.usuario =  Funcoes.getUsuarioLogado();    

    this.verificaTokenExpiracao();

  }

  ngAfterViewInit(): void {

  }


  logout() {
    this.authService.logout();
  }

  refreshToken() {
    this.authService.refreshToken().subscribe((resp: any) => {
	      localStorage.setItem("usuario", JSON.stringify(resp.dados));    
		});
  }


  alterarTitulo(tit: string): void{
	this.title = tit;
  }

  fecharMenuPai(tit: string, idItemMenuPai : string): void{
    this.alterarTitulo(tit);

    const campo: HTMLInputElement = < HTMLInputElement > (document.getElementById(idItemMenuPai));
    campo.classList.remove("show");

  }
  

  getAmbiente(){
    if (this.usuario.s == '172.16.0.241'){
      return "HOMOLOGAÇÃO";
    }
    else{
      return "PRODUÇÃO";
    }
  }

  getS(){
    console.log()
    Funcoes.getUsuarioLogado().s;
  }

  getUserName(){
    var a = Funcoes.getUsuarioLogado();
    return a.username;
    
  }

  verificaTokenExpiracao(){
    
    var a = Funcoes.getUsuarioLogado().expires_at.date;
    

    var hora_expiracao:any = new Date(Funcoes.getUsuarioLogado().expires_at.date);

    var hora_atual:any = new Date(); // Current date now.
    
    var minutos = (hora_expiracao - hora_atual);

    console.log("Hora Expira : " + hora_expiracao);
    console.log("Hora atual : " + hora_atual);
    console.log(" Minutos : " + minutos);

    /*
      5 Minutos = 300000

    */
    if (minutos <= 200000){
          const modal = this.modalService.open(ModalTokenTimerComponent, { size: 'lg' });

          modal. result.then((botao: any) => { 
            console.log(botao)
            if (botao == 'REVALIDOU_TOKEN'){
              setTimeout(() => this.verificaTokenExpiracao(), 60000 );
            }
          });            
    }else{
          setTimeout(() => this.verificaTokenExpiracao(), 60000 );
    }

  }

  getPathFotoUserLogin() {
    var nome_arquivo = Funcoes.getUsuarioLogado().foto;
    var tipo = Funcoes.getUsuarioLogado().tipo;    
    console.log("@@@@@@@@@@@@@@@@");
    console.log(Funcoes.getUsuarioLogado());
    console.log("@@@@@@@@@@@@@@@@");
    return Funcoes.getPathFoto(nome_arquivo, tipo);
}

 
}

