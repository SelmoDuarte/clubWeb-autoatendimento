import { PipeTransform } from "@angular/core";
import { Participante } from "../participantes/participante";
import { SortColumn, SortDirection } from "../participantes/sortable.directives";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalAcessoNegadoComponent } from "../auth/modal-acessoNegado/modal-acessoNegado.component";
import { environment } from "../../environments/environment";


export const PERFIS_TABELAS = "TABELAS";
export const PERFIS_MANUTENCAO = "MANUTENÇÃO";
export const PERFIS_FINANCEIRO = "FINANCEIRO";
 

export class Funcoes {



 static getPathBackEnd() {
      if (environment.AMBIENTE == 'HML') {
          return environment.URL_HOMOLOGACAO;
      } else {
          return environment.URL_PRODUCAO;
      }
  }

  static sort(participantes: Participante[], column: SortColumn, direction: string): Participante[] {
      if (direction === '' || column === '') {
          return participantes;
      } else {
          return [...participantes].sort((a, b) => {
              var res = Funcoes.compare(a[column], b[column]);
              return direction === 'asc' ? res : -res;
          });
      }
  }

  static matches(participante: Participante, term: string) {
      return (
          participante.matricula_id.toLowerCase().includes(term.toLowerCase()) ||
          participante.nome.toLowerCase().includes(term.toLowerCase()) ||
          participante.email.toLowerCase().includes(term.toLowerCase())
      );
  }

  static getElementoCombo(id: string, lista: any) {

      var e!: any;
      for (var i = 0; i < lista.length; i++) {

          e = lista[i];
          if (e.id == id) {
              return e;
          }

      }
      return e;

  }

  static verificaAcesso(perfil: string[]) {
      const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
      var meusAcessos = jsonUsuario.acessos;
      meusAcessos = meusAcessos.toUpperCase();

      var possuiAcesso = false;

      for (var i = 0; i < perfil.length; i++) {
            var e = perfil[i];
            if (meusAcessos.indexOf(e) >= 0) {
                possuiAcesso = true;
            }else{
                return false;
            }
      
       }

       if (!possuiAcesso) {
          return false;
      } else {
          return true;
      }

  }

  static getUsuarioLogado() {
    const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
    return jsonUsuario;
}


  static validarEmail(email: string) {
      if ((email == null) || (email.length < 4))
          return false;

      var partes = email.split('@');
      if (partes.length < 2) return false;

      var pre = partes[0];
      if (pre.length == 0) return false;

      if (!/^[a-zA-Z0-9_.-/+]+$/.test(pre))
          return false;

      // gmail.com, outlook.com, terra.com.br, etc.
      var partesDoDominio = partes[1].split('.');
      if (partesDoDominio.length < 2) return false;

      for (var indice = 0; indice < partesDoDominio.length; indice++) {
          var parteDoDominio = partesDoDominio[indice];

          // Evitando @gmail...com
          if (parteDoDominio.length == 0) return false;

          if (!/^[a-zA-Z0-9-]+$/.test(parteDoDominio))
              return false;
      }

      return true;
  }

  static getErro(e: any) {
      console.log(e);
      var msg = "";
      if (e.error.status == undefined) {
          msg = e.error.message;
      } else {
          msg = e.error.status.mensagem;
      }

      return {
          'type': 'danger',
          'message': msg
      };

  }


  static validarData(valor) {
      // Verifica se a entrada é uma string
      if (typeof valor !== 'string') {
          return false
      }

      // Verifica formado da data
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
          return false
      }

      // Divide a data para o objeto "data"
      const partesData = valor.split('/')
      const data = {
          dia: partesData[0],
          mes: partesData[1],
          ano: partesData[2]
      }

      // Converte strings em número
      const dia = parseInt(data.dia)
      const mes = parseInt(data.mes)
      const ano = parseInt(data.ano)

      // Dias de cada mês, incluindo ajuste para ano bissexto
      const diasNoMes = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

      // Atualiza os dias do mês de fevereiro para ano bisexto
      if (ano % 400 === 0 || ano % 4 === 0 && ano % 100 !== 0) {
          diasNoMes[2] = 29
      }

      // Regras de validação:
      // Mês deve estar entre 1 e 12, e o dia deve ser maior que zero
      if (mes < 1 || mes > 12 || dia < 1) {
          return false
      }
      // Valida número de dias do mês
      else if (dia > diasNoMes[mes]) {
          return false
      }

      // Passou nas validações
      return true
  }


  static isValidCPF(cpf: any) {
      // Validar se é String
      if (typeof cpf !== 'string') return false

      // Tirar formatação
      cpf = cpf.replace(/[^\d]+/g, '')

      // Validar se tem tamanho 11 ou se é uma sequência de digitos repetidos
      if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false

      // String para Array
      cpf = cpf.split('');

      const validator = cpf
          // Pegar os últimos 2 digitos de validação
          .filter((digit: any, index: any, array: any) => index >= array.length - 2 && digit)
          // Transformar digitos em números
          .map((el: string | number) => +el)

      const toValidate = (pop: number) => cpf
          // Pegar Array de items para validar
          .filter((digit: any, index: number, array: string | any[]) => index < array.length - pop && digit)
          // Transformar digitos em números
          .map((el: string | number) => +el)

      const rest = (count: number, pop: number) => (toValidate(pop)
              // Calcular Soma dos digitos e multiplicar por 10
              .reduce((soma: number, el: number, i: number) => soma + el * (count - i), 0) * 10)
          // Pegar o resto por 11
          %
          11
          // transformar de 10 para 0
          %
          10

      return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1])
  }


  static iniciaisMaiuscula(texto: string) {
      //$cadeia = ucwords(strtolower($cadeia)); 
      var cadeia = texto.toLowerCase().replace(/\b[a-z]/g, function(letra) {
          return letra.toUpperCase();
      });

      var min = [" a ", " e ", " o ", " da ", " de ", " do ", " das ", " dos ", " ao ", " aos ", " às ", " é ", " à ", " em ", " no "];
      var mai = [" A ", " E ", " O ", " Da ", " De ", " Do ", " Das ", " Dos ", " Ao ", " Aos ", " Às ", " É ", " À ", " Em ", " No "];

      for (var i = 0; i < 15; i++) {
          cadeia = cadeia.replace(mai[i], min[i]);
      }
      return cadeia;
  }

  static compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

  static state: State = {
      page: 1,
      pageSize: 100,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
  };


}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}


export interface Resposta {

  dados: any;
  status: RespStatus;
}

export interface RespStatus {

  codigo: number;
  mensagem: string;
}

export class Filtro {
  tipo: string = '';
  valor: string = '';
  somenteAtivos: string;
  socios: string;
  dependentes: string;
  nao_socios: string;

  data_inicio: string;
  data_fim: string;
  sintetico: string;
  tipo_pagamento: string;
  usuario: string;

  turma: string;
  atividade: string;
  situacao_financeira: string;
  layout: string;

  categoria: string;
  ano_mes: string;

  convenio: string;
}

export class Alert {
  type!: string;
  message!: string;
}

export class Paginacao {
  total: number;
  page: number = 1;
  pageSize: number = 100;
}