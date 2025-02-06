import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.services';
import { ModalMensagemComponent } from '../../modal-mensagem/modal-mensagem.component';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,  
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
],

  templateUrl: './modal-alterar-senha.component.html',
  styleUrls: ['./modal-alterar-senha.component.css'],
  providers: []  
})


export class ModalAlterarSenhaComponent implements OnInit {
  
  @Input() public usuario:any = {};  
	@ViewChild("campoInicial") campoInicial! : ElementRef;  

  alerts:any = [];  
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
		this.authService.alterarSenha(this.usuario, this.novaSenha).subscribe((resp: any) => {

      this.processando = false;      
      var modal = this.modalService.open(ModalMensagemComponent);
      modal.componentInstance.alerts = Array.from([{ type: "success", message: "Senha alterada com sucesso !!!",  }]);
      setTimeout(() => modal.close(), 1000);        
      this.activeModal.close()
  
    },
 		(err) => {
      this.	processando = false;
      const alert:any =  {};
      alert.type = 'danger';
      alert.message = 'Acesso negado !!!';
      this.alerts.push(alert);

		});
  }


  closeAlert(alert: any) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

}
