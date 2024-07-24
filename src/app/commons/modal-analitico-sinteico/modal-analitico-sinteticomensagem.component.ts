import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-mensagem',
  standalone: true,  
  imports: [CommonModule, AsyncPipe, NgbAlertModule ],  
  templateUrl: './modal-analitico-sintetico.component.html',
  styleUrls: ['./modal-analitico-sintetico.component.css'],
  providers: []  
})


export class ModalAnaliticoSinteticoComponent implements OnInit {
  
  @Input() public alerts: [{type: '', message : ''}];

  constructor(  public activeModal: NgbActiveModal) { }

  ngOnInit(){
   
  }

  clickBotao(opcao: any){
    this.activeModal.close(opcao);
  }

}
