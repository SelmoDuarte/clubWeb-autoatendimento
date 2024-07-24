import { Component, OnInit } from '@angular/core';
import { SorteioService } from './sorteio.service';
import { CommonModule, DecimalPipe, Time } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Atleta, Posicao } from './sorteio.vo';

@Component({
  selector: 'app-sorteio',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe, NgbAlertModule ],
  templateUrl: './sorteio.component.html',
  styleUrl: './sorteio.component.css',
	providers: [provideNgxMask(), SorteioService, DecimalPipe ],  
})
export class SorteioComponent implements OnInit {
  
  listaTimes: any = [];
  listaPosicoes: Posicao[] = [];
  processando = true;
  indexTime = 0;
  
  
  constructor(public service: SorteioService) {

	}
  
  ngOnInit(): void {
		this.service.getTimes().subscribe((resp: any) => {
		  if (resp.status.codigo == 0){
        this.processando = false;
        for (let i = 0; i < resp.dados.length; i++) {
          var time =  resp.dados[i];          
          time = this.getNotasTime(time);
          this.listaTimes.push(time);
        } 

        this.listaPosicoes = resp.listaPosicoes;
		  }
		});
  }

  getAtletaPosicao(time: any, posicao: Posicao){

    var atleta: Atleta = new Atleta;
    atleta.nome = "?";
    atleta.nota = 0;

    for (let i = 0; i < time.total_atletas; i++) {
      var at: Atleta =  time[i];
      if (at.posicao_id == posicao.id){
        atleta = at;
      }
    } 

    var stars: String[] = [];
    for (let i = 0; i < atleta.nota; i++) {
      stars.push("*");
    } 
    atleta.avaliacao = stars;

    return atleta;

  }
  getNotasTime(time: any){

    var stars: String[] = [];
    for (let i = 0; i < (Number(time.nota)/Number(time.total_atletas)); i++) {
      stars.push("*");
    } 
    time.avaliacao = stars;

    stars = [];
    for (let i = 0; i < (Number(time.nota_defesa)/3); i++) {
      stars.push("*");
    } 
    time.avaliacao_defesa = stars;

    stars = [];
    for (let i = 0; i < (Number(time.nota_meio)/3); i++) {
      stars.push("*");
    } 
    time.avaliacao_meio = stars;

    stars = [];
    for (let i = 0; i < (Number(time.nota_ataque)); i++) {
      stars.push("*");
    } 
    time.avaliacao_ataque = stars;

    return time;

  }

}
