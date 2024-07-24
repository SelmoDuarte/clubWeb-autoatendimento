import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-acessoNegado',
  standalone: true,  
  imports: [CommonModule, AsyncPipe, NgbAlertModule ],  
  templateUrl: './modal-acessoNegado.component.html',
  styleUrls: ['./modal-acessoNegado.component.css'],
  providers: []  
})





export class ModalAcessoNegadoComponent implements OnInit {
  
  @Input() public papel: string;
  
  alerts = [
    {
    type: 'danger',
    message: '<b>ATENÇÃO</b>, voçê não está autorizado a executar esta operação. Solicite acesso junto ao gestor.',
  }
];;  


  constructor(  public activeModal: NgbActiveModal) { }

  ngOnInit(){

   
  }


}
