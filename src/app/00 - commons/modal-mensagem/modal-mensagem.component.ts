import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-mensagem',
  standalone: true,  
  imports: [CommonModule, NgbAlertModule ],  
  templateUrl: './modal-mensagem.component.html',
  styleUrls: ['./modal-mensagem.component.css'],
  providers: []  
})


export class ModalMensagemComponent implements OnInit {
  
  @Input() public alerts:any =  [{type: '', message : ''}];

  constructor(  public activeModal: NgbActiveModal) { }

  ngOnInit(){

   
  }


}
