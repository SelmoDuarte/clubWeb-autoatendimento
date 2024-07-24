import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.services';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Funcoes, Resposta } from '../commons/Funcoes';
import { Usuario } from '../auth/usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { ModalAlterarSenhaComponent } from '../auth/modal-alterar-senha/modal-alterar-senha.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbAlertModule,
    HttpClientModule,
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  @ViewChild("campoInicial") campoInicial : ElementRef;  
  usuario: Usuario = new Usuario;
	alerts: Alert[] = [];  
  processando = false;   
  

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,    
  ) {}


  ngOnInit(): void {
    this.authService.logout();
    setTimeout(() => this.campoInicial.nativeElement.focus(), 0);    
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
		this.authService.verificaAcesso(this.usuario).subscribe((resp: Resposta) => {

      if (resp.dados.alterar_senha){
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

      this.usuario = new Usuario;      
  
    },
		(err) => {
      console.log(err);
      this.	processando = false;
      this.alerts.push(Funcoes.getErro(err));

		});
  }

  closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

	public gerarPDF(): void {

		var fonts = {
			Roboto: {
				normal: 'fonts/Roboto-Regular.ttf',
				bold: 'fonts/Roboto-Medium.ttf',
				italics: 'fonts/Roboto-Italic.ttf',
				bolditalics: 'fonts/Roboto-MediumItalic.ttf'
			}
		};
		
	}

}

class Alert {
	type!: string;
	message!: string;
}