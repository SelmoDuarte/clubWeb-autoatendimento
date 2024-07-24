import { CommonModule, DecimalPipe } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild,} from "@angular/core";

import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { HttpClientModule } from "@angular/common/http";
import { NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { Evento, Ingresso, Pessoa } from "./pessoa";
import { Alert, Funcoes, TipoIngresso } from "./Funcoes";
import { CompraManualService } from "./compra-manual.service";
import { Resposta } from "../commons/Funcoes";

@Component({
    selector: "app-compra-manual",
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgbAlertModule,
        HttpClientModule,
    ],
    templateUrl: "./compra-manual.component.html",
    styleUrl: "./compra-manual.component.css",
    providers: [provideNgxMask(), CompraManualService, DecimalPipe ],    	   
})

export class CompraManualComponent implements OnInit, AfterViewInit {
    constructor(
        private service: CompraManualService,
        private route: ActivatedRoute,
    ) {}
    listaEventos: Evento[] = [];
    listaTiposIngresso: TipoIngresso[] = [];
    listaIngressos: Ingresso[] = [];
    processando: boolean = true;
    alerts: Alert[] = [];
    valorTotal: number = 0;
    mesmoAnterior: boolean[] = [];
    fase: number = 1;
    desativar = false;
    urlBanner = "";
    compra_finalizada = false;
    ngOnInit() {
        this.processando = true;
        var eventos_id: any = this.route.snapshot.paramMap.get("id");
        this.service.getListaEvento('').subscribe(
            (response :Resposta) => {
                if (response.status.codigo !== 0) {
                    this.alerts = Array.from([{
                        type: "danger",
                        message: "ATENÇÃO, inscrições encerradas !!!",
                    }]);
                    this.processando = false;
                    this.desativar = true;
                    return;
                }
                this.listaEventos = response.dados;
                this.listaTiposIngresso = Funcoes.getListaTiposIngressoByLista(this.listaEventos);
                for (var i = 0; i < this.listaTiposIngresso.length; i++) {
                    var t: TipoIngresso = this.listaTiposIngresso[i];
                    this.valorTotal = Number(this.valorTotal) + (Number(t.qtd_ingresso) * Number(t.valor));
                    this.mesmoAnterior.push(false);
                }
                this.processando = false;
            },
            (erroResponse) => {
                this.processando = false;
                alert(erroResponse);
            }
        );
    }
    ngAfterViewInit() {}
    qtdEvento(evento_id: string, id: string, valor: number) {
        var evento = Funcoes.getEvento(evento_id, this.listaEventos);
        this.alerts = [];
        const campo: HTMLInputElement = < HTMLInputElement > (document.getElementById("qtd-" + evento_id + "-" + id));
        var v = Number(campo.value) + valor;
        if (v < 0) {
            v = 0;
        }
        if (evento.comprar_varios_ingressos !== "Sim") {
            if (v > 1) {
                this.alerts = Array.from([{
                    type: "danger",
                    message: "ATENÇÃO, só é permitido uma inscrição por CPF",
                }, ]);
                this.processando = false;
                return;
            }
            campo.value = String(v);
            const campo1: HTMLInputElement = < HTMLInputElement > (document.getElementById("qtd-" + evento_id + "-1"));
            var v1 = Number(campo1.value);
            const campo2: HTMLInputElement = < HTMLInputElement > (document.getElementById("qtd-" + evento_id + "-2"));
            var v2 = 0;
            if (campo2 != undefined) {
                v2 = Number(campo2.value);
            }
            if (v1 + v2 > 1) {
                this.alerts = Array.from([{
                    type: "danger",
                    message: "ATENÇÃO, só é permitido a aquisição de um ingresso por CPF",
                }]);
                this.processando = false;
                campo.value = String(v - 1);
                return;
            }
        } else {
            campo.value = String(v);
        }
        var l = this.listaTiposIngresso;
        this.listaTiposIngresso = Funcoes.atualizarQtdIngressos(l);
        this.valorTotal = 0;
        this.listaIngressos = [];
        var k = 1;
        for (var i = 0; i < this.listaTiposIngresso.length; i++) {
            var t: TipoIngresso = this.listaTiposIngresso[i];
            this.valorTotal = Number(this.valorTotal) + (Number(t.qtd_ingresso) * Number(t.valor));
            for (var ii = 0; ii < t.qtd_ingresso; ii++) {
                var t: TipoIngresso = this.listaTiposIngresso[i];
                var ingresso = new Ingresso;
                ingresso.id = "" + k++;
                ingresso.evento_id = t.evento_id;
                ingresso.descricao = t.descricao;
                ingresso.valor = t.valor;
                ingresso.qtd_ingresso = t.qtd_ingresso;
                ingresso.mensagem = t.mensagem;
                ingresso.tipo = t.tipo;
                ingresso.pessoa = new Pessoa;
                ingresso.mesmoAnterior = 'Não';
                this.listaIngressos.push(ingresso);
            }
        }
    }
    copiarDadosAnterior(id: string) {
        const c: HTMLInputElement = < HTMLInputElement > (document.getElementById("checkBoxMAnt-" + id));
        this.mesmoAnterior[Number(id)] = c.checked;
    }
    ocultarDadosPessoas(id: string) {
        if (this.mesmoAnterior[Number(id)]) {
            return true;
        } else {
            return false;
        }
    }
    proximo(id: number) {
        this.alerts = [];
        if ((this.fase + id) == 1) {
            document.getElementById('faq_tab_1-tab').classList.add("faseAtiva");
            document.getElementById('faq_tab_2-tab').classList.remove("faseAtiva");
            document.getElementById('faq_tab_3-tab').classList.remove("faseAtiva");
            document.getElementById('faq_tab_4-tab').classList.remove("faseAtiva");
            document.getElementById('faq_tab_1').classList.remove("ocultar");
            document.getElementById('faq_tab_2').classList.add("ocultar");
            document.getElementById('faq_tab_3').classList.add("ocultar");
            this.fase = this.fase + id;
        }
        if ((this.fase + id) == 2) {
            if (this.listaIngressos.length <= 0) {
                this.alerts = Array.from([{
                    type: "danger",
                    message: "ATENÇÃO, selecione a quantidade !!!",
                }]);
                return;
            }
            document.getElementById('faq_tab_1-tab').classList.add("faseAtiva");
            document.getElementById('faq_tab_2-tab').classList.add("faseAtiva");
            document.getElementById('faq_tab_3-tab').classList.remove("faseAtiva");
            document.getElementById('faq_tab_4-tab').classList.remove("faseAtiva");
            document.getElementById('faq_tab_1').classList.add("ocultar");
            document.getElementById('faq_tab_2').classList.remove("ocultar");
            document.getElementById('faq_tab_3').classList.add("ocultar");
            this.fase = this.fase + id;
            return;
        }
        if ((this.fase + id) == 3) {
            if (this.listaIngressos.length <= 0) {
                this.alerts = Array.from([{
                    type: "danger",
                    message: "ATENÇÃO, selecione a quantidade !!!",
                }]);
                return;
            }
            var _listaIngressos = [];
            for (var i = 0; i < this.listaIngressos.length; i++) {
                var ingresso: Ingresso = this.listaIngressos[i];
                var evento_id = ingresso.evento_id;
                var evento = Funcoes.getEvento(evento_id, this.listaEventos);
                var c: any = document.getElementById('cpf-' + ingresso.id);
                var cpf = c.value;
                c = document.getElementById('nome-' + ingresso.id);
                var nome = c.value;
                c = document.getElementById('numero_titulo-' + ingresso.id);
                var numero_titulo = c.value;
                c = document.getElementById('celular-' + ingresso.id);
                var celular = c.value;
                c = document.getElementById('email-' + ingresso.id);
                var email = c.value;
                ingresso.pessoa.cpf = cpf;
                ingresso.pessoa.nome = nome;
                ingresso.pessoa.numero_titulo = numero_titulo;
                ingresso.pessoa.celular = celular;
                ingresso.pessoa.email = email;
                if (this.mesmoAnterior[Number(ingresso.id)]) {
                    var _p = this.listaIngressos[i - 1].pessoa;
                    ingresso.pessoa.cpf = _p.cpf;
                    ingresso.pessoa.nome = _p.nome;
                    ingresso.pessoa.numero_titulo = _p.numero_titulo;
                    ingresso.pessoa.celular = _p.celular;
                    ingresso.pessoa.email = _p.email;
                }
                _listaIngressos.push(ingresso);
            }
            this.listaIngressos = _listaIngressos;
            for (var i = 0; i < this.listaIngressos.length; i++) {
                var ingresso: Ingresso = this.listaIngressos[i];
                var pessoa: Pessoa = ingresso.pessoa;
                if (pessoa.cpf == '') {
                    this.alerts = Array.from([{
                        type: "danger",
                        message: "ATENÇÃO, CPF inválido !!!",
                    }]);
                    var c: any = document.getElementById('cpf-' + ingresso.id);
                    c.focus();
                    return;
                }
                if (!Funcoes.isValidCPF(pessoa.cpf)) {
                    this.alerts = Array.from([{
                        type: "danger",
                        message: "ATENÇÃO, CPF inválido !!!",
                    }]);
                    var c: any = document.getElementById('cpf-' + ingresso.id);
                    c.focus();
                    return;
                }
                if (pessoa.nome == '') {
                    this.alerts = Array.from([{
                        type: "danger",
                        message: "ATENÇÃO, Nome inválido !!!",
                    }]);
                    var c: any = document.getElementById('nome-' + ingresso.id);
                    c.focus();
                    return;
                }
                if (pessoa.numero_titulo == '' && evento.permitir_nao_socio != 'Sim') {
                    this.alerts = Array.from([{
                        type: "danger",
                        message: "ATENÇÃO, evento exclusivo para sócio, informe o numero do Título Minas válido e ativo !!!",
                    }]);
                    var c: any = document.getElementById('numero_titulo-' + ingresso.id);
                    c.focus();
                    return;
                }
                if (pessoa.celular == '') {
                    this.alerts = Array.from([{
                        type: "danger",
                        message: "ATENÇÃO, celulár inválido !!!",
                    }]);
                    var c: any = document.getElementById('celular-' + ingresso.id);
                    c.focus();
                    return;
                }
                if (pessoa.email == '') {
                    this.alerts = Array.from([{
                        type: "danger",
                        message: "ATENÇÃO, email inválido !!!",
                    }]);
                    var c: any = document.getElementById('email-' + ingresso.id);
                    c.focus();
                    return;
                } else if (!Funcoes.validarEmail(pessoa.email)) {
                    this.alerts = Array.from([{
                        type: "danger",
                        message: "ATENÇÃO, email inválido !!!",
                    }]);
                    var c: any = document.getElementById('email-' + ingresso.id);
                    c.focus();
                    return;
                }
            }
            document.getElementById('faq_tab_1-tab').classList.add("faseAtiva");
            document.getElementById('faq_tab_2-tab').classList.add("faseAtiva");
            document.getElementById('faq_tab_3-tab').classList.add("faseAtiva");
            document.getElementById('faq_tab_4-tab').classList.remove("faseAtiva");
            document.getElementById('faq_tab_1').classList.add("ocultar");
            document.getElementById('faq_tab_2').classList.add("ocultar");
            document.getElementById('faq_tab_3').classList.remove("ocultar");
            this.fase = this.fase + id;
            return;
        }
        if ((this.fase + id) == 4 || (this.fase + id) == 5) {

            if (this.listaIngressos.length <= 0) {
                this.alerts = Array.from([{
                    type: "danger",
                    message: "ATENÇÃO, selecione a quantidade !!!",
                }]);
                return;
            }

            this.processando = true;
            document.getElementById('faq_tab_4-tab').classList.add("faseAtiva");
            var pessoa = this.listaIngressos[0].pessoa;
            let cielo_id = Funcoes.gerarCieloID(pessoa);
            let url_cielo = "";
            this.service.compra_manual(cielo_id, pessoa, this.listaIngressos, this.listaTiposIngresso, "")
                .subscribe(
                    (response: Resposta) => {
                        if (response.status.codigo == 0) {
                            this.alerts = Array.from([{
                                type: 'success',
                                message: 'Inscrições realizadas com sucesso'
                            }]);
                            this.processando = false;
                            this.compra_finalizada = true;
                        } else {
                            this.alerts = Array.from([{
                                type: 'danger',
                                message: response.status.mensagem
                            }]);
                            document.getElementById('faq_tab_4-tab').classList.remove("faseAtiva");
                            this.processando = false;
                            this.fase = 3;
                            return;
                        }
                    },
                    (erroResponse) => {
                        this.alerts = Array.from([{
                            type: 'danger',
                            message: erroResponse.error.status.mensagem
                        }]);
                        this.processando = false;
                        return;
                    });
            this.fase = 4;
        }
    }
    getListaPessoasEvento(evento_id, tipo) {
        var _listaPessoas: Pessoa[] = [];
        for (var i = 0; i < this.listaIngressos.length; i++) {
            var ingresso = this.listaIngressos[i];
            if (ingresso.evento_id == evento_id && ingresso.tipo == tipo) {
                _listaPessoas.push(ingresso.pessoa);
            }
        }
        return _listaPessoas;
    }
    gotoStepTo(id) {
        this.fase = id;
        this.proximo(0);
    }
    closeAlert(alert: Alert) {
        this.alerts.splice(this.alerts.indexOf(alert), 1);
    }
}