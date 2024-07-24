import { AfterViewInit, Component, OnInit, Optional } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.services';
import { CommonModule } from '@angular/common';
import { SocialUser } from '@abacritt/angularx-social-login';
import { environment } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBaixaColetivaAtividadeComponent } from '../financeiro/baixa-coletiva-ativdade/modal-baixa-coletiva-atividade/modal-baixa-coletiva-atividade.component';
import { Usuario } from '../auth/usuario';
import { Funcoes } from '../commons/Funcoes';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, AfterViewInit{

  isLoggedIn$!: Observable<boolean>;
  title: string = "Inscrições > Andamento";
  usuario : Usuario;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.usuario =  Funcoes.getUsuarioLogado();    

  }

  ngAfterViewInit(): void {


    console.log('AAA');
    console.log(Funcoes.getUsuarioLogado());
    console.log('AAA');    


  }


  logout() {
    this.authService.logout();
  }

  baixaColetivaAtividade() {

    this.fecharMenuPai('Financeiro > Baixa Manual', 'itemMenuFinanceiro');
    
    const modal = this.modalService.open(ModalBaixaColetivaAtividadeComponent, { size: 'xl' });

    modal.componentInstance.id =null;            
    

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
    return environment.AMBIENTE;
  }

  getS(){
    Funcoes.getUsuarioLogado().s;
  }
}

