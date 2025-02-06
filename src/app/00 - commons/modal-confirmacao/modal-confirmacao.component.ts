import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmacao',
  standalone: true,  
  imports: [CommonModule, AsyncPipe, NgbAlertModule ],  
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.css'],
  providers: []  
})


export class ModalConfirmacaoComponent implements OnInit {
  
  @Input() public alerts:any =  [{type: '', message : ''}];

  constructor(  public activeModal: NgbActiveModal) { }

  ngOnInit(){

   
  }


}
