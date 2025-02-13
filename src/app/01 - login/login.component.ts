import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../00 - commons/auth/auth.services';
import { ModalAlterarSenhaComponent } from '../00 - commons/auth/modal-alterar-senha/modal-alterar-senha.component';
import { ModalMensagemComponent } from '../00 - commons/modal-mensagem/modal-mensagem.component';
import { Funcoes } from '../00 - commons/Funcoes';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgxMaskDirective,
],
providers: [provideNgxMask()],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  @ViewChild("campoInicial") campoInicial! : ElementRef;  
  usuario: any = {};
	alerts:any  = [];  
  processando = false;   
  

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,   
    private router: Router,         
  ) {}


  ngOnInit(): void {
    this.authService.logout();
  }

  ngAfterViewInit() {
    setTimeout(() => this.campoInicial.nativeElement.focus(), 100);
  }


  login() {

    if (this.usuario.userName == undefined || this.usuario.userName == ''){
        this.alerts = Array.from([{  type: "danger",   message: "ATENÇÃO, Usuário inválido !!!",  }]);
        var c: any = document.getElementById('userName');
        c.focus();
        return;
    }

    if (this.usuario.password == undefined || this.usuario.password == ''){
      this.alerts = Array.from([{  type: "danger",   message: "ATENÇÃO, Senha inválida !!!",  }]);
      var c: any = document.getElementById('password');
      c.focus();
      return;
  }


    this.	processando = true;
		this.authService.verificaAcesso(this.usuario).subscribe((resp: any) => {

      if (resp.dados.alterar_senha == '1'){
        this.alerts = [];
        const modal = this.modalService.open(ModalAlterarSenhaComponent);

        modal. result.then(() => { 
          this.	processando = false;
        }, () => { 
          this.	processando = false;
        })
    
    
        this.usuario.password = "";
        modal.componentInstance.usuario =this.usuario;      
        return;
      }
      localStorage.setItem("usuario", JSON.stringify(resp.dados));    
      this.authService.login(this.usuario);        
      this.	processando = false;

      this.usuario = {};      
  
    },
    (e: any) => { 
      /* TRATAMENTO ERRO SERVICE */
      this.processando = false;
      var msgErro: any  = Funcoes.tratarErrorService(e);
      var modal = this.modalService.open(ModalMensagemComponent);
      modal.componentInstance.alerts = Array.from([{ type: "danger", message: msgErro.message,  }]);
      setTimeout(() => modal.close(), 3000);
      if (msgErro.redirect_login == 'S' ){
        this.router.navigate(['/login']);
      }
      this.authService.logErrorService(msgErro).subscribe((resp: any) => {
        console.log('Registra Erro');
      });    
      /* FIM TRATAMENTO ERRO SERVICE */

  });

  }

  closeAlert(alert: any) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}
}