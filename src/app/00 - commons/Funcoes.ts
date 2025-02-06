import { PipeTransform } from "@angular/core";
import { environment } from "../../environments/environment";

export const PERFIS = {
    ADMIN:  'ADMIN',     
    HOME:  'HOME', 
    RELATORIO: 'RELATORIO',  
    FINANCEIRO: 'FINANCEIRO',  
    BAIXA_COLETIVA_ATIVIDADE: 'BAIXA-COLETIVA-ATIVIDADE',  
    EVENTOS: 'EVENTOS',  
    FINANCEIRO_RECEITA: 'FINANCEIRO-RECEITA',  
    GERAL: 'GERAL',  
    TABELAS: 'TABELAS',  
    GERAR_ARRECADACAO_MENSAL: 'GERAR-ARRECADACAO-MENSAL',  
    GERAR_ARQUIVO_REMESSA: 'GERAR-ARQUIVO-REMESSA',  
    IMPORTAR_LISTA_CONVIDADOS_EXCEL: 'IMPORTAR-LISTA-CONVIDADOS-EXCEL',  
    MANUTENCAO_CONVIDADOS: 'MANUTENCAO-CONVIDADOS',  
    DEPENDENTE_MANUTENCAO: 'DEPENDENTE-MANUTENCAO',  
    LANCAMENTO_MANUTENCAO: 'LANCAMENTO-MANUTENCAO',  
    LANCAMENTO_EXCLUIR: 'LANCAMENTO-EXCLUIR',  
    GERAR_BOLETO: 'GERAR-BOLETO',  
    LANCAMENTO_BAIXA_MANUAL: 'LANCAMENTO-BAIXA-MANUAL',  
    DEPENDENTE_EXCLUIR: 'DEPENDENTE-EXCLUIR',  
    NAO_SOCIO_MANUTENCAO: 'NAO-SOCIO-MANUTENCAO',  
    ESPORTE_MATRICULA: 'ESPORTE-MATRICULA',  
    LANCAMENTO_CANCELAR_BAIXA: 'LANCAMENTO-CANCELAR-BAIXA',  
    ASSOCIADO_ANEXO_EXCLUIR: 'ASSOCIADO-ANEXO-EXCLUIR',  
    ADIANTAMENTO: 'ADIANTAMENTO',  
    EXCLUIR_LISTA_CONVIDADOS_EXCEL: 'EXCLUIR-LISTA-CONVIDADOS-EXCEL',  
    ASSOCIADO_EXCLUIR: 'ASSOCIADO-EXCLUIR',  
    EDITAR_FOTO: 'EDITAR-FOTO',  
    NAUTICA_MANUTENCAO: 'NAUTICA-MANUTENCAO',  
    NAUTICA_EXCLUIR: 'NAUTICA-EXCLUIR',  
    FUNCIONARIO_MANUTENCAO: 'FUNCIONARIO-MANUTENCAO',  
    FUNCIONARIO_EXCLUIR: 'FUNCIONARIO-EXCLUIR',  
    CONCESSIONARIO_MANUTENCAO: 'CONCESSIONARIO-MANUTENCAO',  
    BAIXA_ARQUIVO_RETORNO: 'BAIXA-ARQUIVO-RETORNO',  
    IMPRIMIR_FICHA: 'IMPRIMIR-FICHA',
    SETOR_PRESIDENCIA: 'SETOR-PRESIDENCIA',  
    SETOR_SECRETARIA: 'SETOR-SECRETARIA',  
    SETOR_ESPORTE: 'SETOR-ESPORTE',      
    SETOR_ACADEMIA: 'SETOR-ACADEMIA',      
} as const;

export const FORM_ASSOCIADO_CAMPOS_EDICAO_PERFIL_SETOR_ESPORTE = ['nome_abrev', 'tel2'] as const;
export const FORM_DEPENDENTE_CAMPOS_EDICAO_PERFIL_SETOR_ESPORTE = ['nome_abrev', 'tel2'] as const;


export const TABELAS = "TABELAS";
export const PERFIS_MANUTENCAO = "MANUTENÇÃO";
export const PERFIS_FINANCEIRO = "FINANCEIRO";
 

export class Funcoes {


 static getPathBackEnd() {

    return environment.URL;
  }


  static getElementoCombo(id: string, lista: any) {

      var e!: any;
      for (var i = 0; i < lista.length; i++) {

          e = lista[i];
          if (e.id == id) {
              return e;
          }

      }
      return {};

  }

  static verificaAcesso(perfil: string[], todos_acessos = true) {
      const jsonUsuario = JSON.parse("" + localStorage.getItem("usuario"));
      var meusAcessos = jsonUsuario.acessos;
      meusAcessos = meusAcessos.toUpperCase();

      var possuiAcesso = false;

      for (var i = 0; i < perfil.length; i++) {
            var e = perfil[i];
            if (meusAcessos.indexOf(e) >= 0) {
                possuiAcesso = true;
            }else{
                if (todos_acessos){
                    return false;
                }
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

  static tratarErrorService(e: any) {

    var msg: any = this.getErro(e);
    console.error(msg.message);
    if (e.status == 401){
        msg.message = "<b>Atenção:</b> sua sessão expirou. Por favor, faça login novamente";
        msg.redirect_login = 'S';
    }

    return msg;

  }

  static getErro(e: any) {
    console.log(e);
      var msg = "";

      if (e.error !== null ){
        msg = e.error.message;
      }else{
        msg = e.message;
      }

      return {
          'type': 'danger',
          'message': msg,
          icon: "",
          'redirect_login': 'N',
          code : e.status
      };

  }


  static validarData(valor: any) {
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

  static getIdade(valor: any) {
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


	var dataNascimento = new Date(0 + ano, 0 + mes - 1, 0 + dia);
	var hoje = new Date();

    let age = hoje.getFullYear() - dataNascimento.getFullYear();

    if ( dataNascimento.getMonth() > hoje.getMonth() || ( dataNascimento.getMonth() == hoje.getMonth() && dataNascimento.getDay() >= hoje.getDay()) ){
        age = age - 1;
    }

    return age;
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

    static getPathFoto(nome_arquivo: string, tipo: string) {
        if (nome_arquivo == "" || nome_arquivo == null){
            return '/assets/img/pessoaNaoIdentificada.png';
        }
        if (tipo == 'S' ||  tipo == '1'){
            return '/ged/Fotos/Titular/' + nome_arquivo;
        }else if (tipo == 'D' ||  tipo == '2'){
            return '/ged/Fotos/Dependentes/' + nome_arquivo;
        }else if (tipo == 'N' ||  tipo == '3'){
            return '/ged/Fotos/Alunos/' + nome_arquivo;
        }else if (tipo == 'F' ||  tipo == '4'){
            return '/ged/Fotos/Visitantes/' + nome_arquivo;
        }else if (tipo == 'H' ||  tipo == '5'){
            return '/ged/Fotos/Dependentes/' + nome_arquivo;
        }else{
            return '/assets/img/pessoaNaoIdentificada.png';
        }
    }

    static getPathAnexo(id:string, nome_arquivo: string, $tipo: string) {
        if ($tipo == 'S'){
            return '/ged/Documentos/DOC_SOCIOS/' + id + "/" + nome_arquivo;
        }
        if ($tipo == 'N'){
            return '/ged/Documentos/DOC_ALUNOS/' + id + "/" + nome_arquivo;
        }

        return ""; 

    }


    static getSexo(s: string){
        if(s == 'M'){
            return  'Masculino'
        }else{
            return  'Feminino'            
        }
    }


    static getMesExtenso(mes : number){
        var a = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];  
        return a[Number(mes)];
    }

  static iniciaisMaiuscula(texto: string) {

      texto = texto.toLocaleLowerCase();
      var cadeia = texto.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
      cadeia = cadeia.replaceAll('(cof)', '(COF)');
      cadeia = cadeia.replaceAll(' uci', '(UCI)');      
      cadeia = cadeia.replaceAll('Uci', '(UCI)');            
      cadeia = cadeia.replaceAll('ucd', 'UCD');     
      cadeia = cadeia.replaceAll('Ucd', 'UCD');           
      cadeia = cadeia.replaceAll(' Tp',     ' TP');                  
      cadeia = cadeia.replaceAll(' Do ', ' do ');      
      cadeia = cadeia.replaceAll('(tp)', '(TP)');            
      cadeia = cadeia.replaceAll(' Ucfj', ' UCFJ');
      cadeia = cadeia.replaceAll(' Uci-j', ' UCI-J');
      cadeia = cadeia.replaceAll('Ii', 'II');            
      cadeia = cadeia.replaceAll('Iii', 'III');  
      cadeia = cadeia.replaceAll('- Con', '- CON');  
      cadeia = cadeia.replaceAll('Não', 'não');
      cadeia = cadeia.replaceAll(' E ', ' e ');
      cadeia = cadeia.replaceAll(' De ', ' de ');
      cadeia = cadeia.replaceAll(' Do ', ' do ');      

      cadeia = cadeia.replaceAll('CONfecção', 'Confecção');
      cadeia = cadeia.replaceAll('Natação/equipe', 'Natação/Equipe');
      
      return cadeia;
  }
  

  static compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);


  static getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
    
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);
    
        var dataURL = canvas.toDataURL("image/png");
    
        resolve(dataURL);
      };
    
      img.onerror = error => {
        reject(error);
        console.log("ERRO" + error);
      };
    
      img.src = url;
    });
}

static getRandomInteger(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  

  static numeroPorExtenso(numero: number): string {
    const unidades = ["", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove"];
    const especiais = ["Dez", "Onze", "Doze", "Treze", "Quatorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove"];
    const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    const centenas = ["", "cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
    const milhares = ["", "mil", "milhão", "milhões", "bilhão", "bilhões", "trilhão", "trilhões"];

    if (numero === 0) return "zero";

    function porExtenso(num: number): string {
        let resultado = "";
        
        if (num >= 100) {
            const c = Math.floor(num / 100);
            resultado += centenas[c];
            num %= 100;
            if (num > 0) resultado += " e ";
        }
        
        if (num >= 10 && num <= 19) {
            resultado += especiais[num - 10];
        } else if (num >= 20) {
            const d = Math.floor(num / 10);
            resultado += dezenas[d];
            num %= 10;
            if (num > 0) resultado += " e ";
        }

        if (num > 0 && num < 10) {
            resultado += unidades[num];
        }

        return resultado;
    }

    let partes: string[] = [];
    let unidadeMilhar = 0;

    while (numero > 0) {
        const parteAtual = numero % 1000;
        if (parteAtual > 0) {
            let prefixo = porExtenso(parteAtual);
            if (unidadeMilhar > 0) {
                prefixo += " " + (parteAtual > 1 ? milhares[unidadeMilhar * 2] : milhares[unidadeMilhar * 2 - 1]);
            }
            partes.unshift(prefixo);
        }
        unidadeMilhar++;
        numero = Math.floor(numero / 1000);
    }

    return partes.join(" e ");
}

    static verificaFaixaContribuicao(categoria_descricao: string, parentesco_descricao: string , dependente: any ){

        /*
            IDCATEGORIA
           7   => DEP. ESPECIAL - I -
           43  => DEP. ESPECIAL - II -
           311 => DEP. ESPECIAL - III -
        */


        if (Funcoes.validarData(dependente.dtnasc)){
            var data = dependente.dtnasc;
            var idade = Number(Funcoes.getIdade(data));
            dependente.idade = idade;
        }        

        if ( categoria_descricao == 'UCD' ){
            dependente.faixa = "ISENTO";
            return dependente;
        }  

        if ( parentesco_descricao == 'CONJUGE'  || parentesco_descricao == 'UNIãO ESTáVEL' || parentesco_descricao == 'DEPENDENTE ISENTO'){
            dependente.faixa = "ISENTO";
            return dependente;
        }  

        if (Funcoes.validarData(dependente.dtnasc)){
            var data = dependente.dtnasc;
            var idade = Number(Funcoes.getIdade(data));
            dependente.idade = idade;

            if ( parentesco_descricao == 'FILHO(A)' || parentesco_descricao == 'AFILHADO(A)' || parentesco_descricao == 'ENTEADO(A)'){
                if (idade <= 21){
                    dependente.faixa = "ISENTO";
                    return dependente;
                }else{
                    if (idade <= 24 && dependente.flg_filho_maior_estudante == 'S'){
                        dependente.faixa = "ISENTO";
                        return dependente;    
                    }else{
                        dependente.faixa ="ATÉ 30 ANOS";                    
                        dependente.idcobranca = "10";
                        dependente.idcategoria = "7";    
                    }
                }    
            }else{
                dependente.faixa ="ATÉ 30 ANOS";                    
                dependente.idcobranca = "10";
                dependente.idcategoria = "7";    
            }


            if (idade > 21 && idade <= 30){
                dependente.faixa = "ATÉ 30 ANOS";
                dependente.idcobranca = "10";
                dependente.idcategoria = "7";
                return dependente;
            }
            if (idade > 30 && idade <= 49){
                dependente.faixa = "ENTRE 31 E 49 ANOS";
                dependente.idcobranca = "10";
                dependente.idcategoria = "43";

                return dependente;
            }
            if (idade >= 50 && idade <= 59){
                dependente.faixa = "ENTRE 50 E 59 ANOS";
                dependente.idcobranca = "10";
                dependente.idcategoria = "311";

                return dependente;
            }
            if (idade > 59){
                if (parentesco_descricao == 'PAI' || parentesco_descricao == 'PADRASTRO' || parentesco_descricao == 'MÃE' || parentesco_descricao == 'MADRASTA' || parentesco_descricao == 'SOGRO(A)'){
                    dependente.faixa = "ISENTO";
                    return dependente;
                }else{
                    dependente.faixa = "ACIMA DE 50 ANOS";
                    dependente.idcobranca = "10";
                    dependente.idcategoria = "311";
                    return dependente;
                }
            }
            return dependente;
        }else{
            dependente.idade = '';
            dependente.faixa = '';
            return dependente;
        }

    }

    static getPlanoAtividade(e:any){
        var plano = "MENSAL";
        if (
            e.idturma == 82 || /* ACADEMIA  ANUAL*/
            e.idturma == 85 || /* ACADEMIA ANUAL */
            e.idturma == 74 || /* NATACAO ANUAL*/
            e.idturma == 87 || /* NATACAO ANUAL */
            e.idturma == 80 || /* HIDRO ANUAL*/
            e.idturma == 89    /* HIDRO ANUAL*/
        ){
            plano = 'ANUAL';
        }
        if (
            e.idturma == 83 || /* ACADEMIA */
            e.idturma == 84 || /* ACADEMIA */
            e.idturma == 73 || /* NATACAO */                    
            e.idturma == 86 || /* NATACAO */                    
            e.idturma == 79 || /* HIDRO */                    
            e.idturma == 88  /* HIDRO */
        ){
            plano = "SEMESTRAL";
        }
        return plano;

    }

    static leftPad(value:string, totalWidth: number, paddingChar: string) {
        var length = totalWidth - value.toString().length + 1;
        return Array(length).join(paddingChar || '0') + value;
    };

    static getCodigoTipoPessoa(tipo: string){
        
        if (tipo == 'S'){ /* SOCIO*/
            return 1;
        }

        if (tipo == 'D'){ /* DEPENDENTE */
            return 2;
        }

        if (tipo == 'N'){ /*  ALUNO ATIVIDADE*/
            return 3;
        }

        if (tipo == 'F'){ /* FUNCIONARIO */
            return 4;
        }

        if (tipo == 'H'){ /* CONCESSIONARIO COLABORADOR */
            return 5;
        }

        if (tipo == 'C'){ /* CONVITE */
            return 6;
        }

        if (tipo == 'L'){ /* LISTA */
            return 7;
        }

        if (tipo == 'G'){ /* CONCESSIONARIO */
            return 8;
        }

        return 0;
    }
}



