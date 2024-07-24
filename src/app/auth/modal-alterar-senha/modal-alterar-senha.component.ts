import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Alert, Resposta } from '../../commons/Funcoes';
import { Usuario } from '../usuario';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AuthService } from '../auth.services';
import { ModalMensagemComponent } from '../../commons/modal-mensagem/modal-mensagem.component';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,  
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgbAlertModule,
],

  templateUrl: './modal-alterar-senha.component.html',
  styleUrls: ['./modal-alterar-senha.component.css'],
  providers: []  
})


export class ModalAlterarSenhaComponent implements OnInit {
  
  @Input() public usuario: Usuario = new Usuario;  
	@ViewChild("campoInicial") campoInicial : ElementRef;  

  alerts = [];  
  processando = false;
  novaSenha: string = '';
  novaSenha_repetir: string = '';

  constructor(  
    public activeModal: NgbActiveModal,
    private authService: AuthService,    
    private modalService: NgbModal,        
  ) { }


  ngOnInit(){

    this.usuario.password = "";
    setTimeout(() => this.campoInicial.nativeElement.focus(), 0);    
   
  }

  alterarSenha() {

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

    if (this.novaSenha == '' || this.novaSenha_repetir == '' ||  !( this.novaSenha == this.novaSenha_repetir)){
      this.alerts = Array.from([{  type: "danger",   message: "ATENÇÃO, Senha inválida !!!",  }]);
      var c: any = document.getElementById('novaSenha');
      c.focus();
      return;
    }


    this.processando = true;
		this.authService.alterarSenha(this.usuario, this.novaSenha).subscribe((resp: Resposta) => {

      this.processando = false;      
      var modal = this.modalService.open(ModalMensagemComponent);
      modal.componentInstance.alerts = Array.from([{ type: "success", message: "Senha alterada com sucesso !!!",  }]);
      setTimeout(() => modal.close(), 1000);        
      this.activeModal.close()
  
    },
 		(err) => {
      this.	processando = false;
      const alert =  new Alert;
      alert.type = 'danger';
      alert.message = 'Acesso negado !!!';
      this.alerts.push(alert);

		});
  }


  closeAlert(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

}
