import { Evento, Pessoa } from "./pessoa";

export class Funcoes {

	static INGRESSO_SOCIO_NOME = ' SÓCIO';
	static INGRESSO_SOCIO_MENSAGEM = 'Por favor, lembre-se de apresentar sua carteirinha de sócio na entrada do evento e garantir que suas mensalidades estejam em dia.'
	static INGRESSO_SOCIO_APENAS_MENSAGEM = 'Exclusivo para os associados do Minas Tênis Clube.'  
	static INGRESSO_NAO_SOCIO_NOME = ' CONVIDADO/ NÃO SÓCIO';
	static INGRESSO_NAO_SOCIO_MENSAGEM = '';


 static gerarCieloID(pessoa: Pessoa){

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm =  "" + today.getMonth() + 1; // Months start at 0!
    let dd = "" + today.getDate();
    
    if ((today.getDate()) < 10) dd = '0' + dd;
    if ((today.getMonth() + 1) < 10) mm = '0' + (today.getMonth() + 1);
    
    const formattedToday = yyyy + mm + dd;
    
    return pessoa.cpf.replaceAll(".","").replaceAll("-","") + "-" + formattedToday+ "-" + this.getRandomic(1000,9999) ;
    
 }

 static getRandomic(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is 
  }
  
  static dataAtualExtenso() {
    var extenso;
    
    var data = new Date();
  
    var day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
    var date = data.getDate();
    var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()];
    var year = data.getFullYear();
  
    return day + ', ' +  date + ' de  ' + month + ' de  ' + year;
  }

  static validarEmail(email:string){
    if ((email == null) || (email.length < 4))
      return false;
  
      var partes = email.split('@');
      if (partes.length < 2 ) return false;
  
      var pre = partes[0];
      if (pre.length == 0) return false;
      
      if (!/^[a-zA-Z0-9_.-/+]+$/.test(pre))
          return false;
  
      // gmail.com, outlook.com, terra.com.br, etc.
      var partesDoDominio = partes[1].split('.');
      if (partesDoDominio.length < 2 ) return false;
  
      for ( var indice = 0; indice < partesDoDominio.length; indice++ )
      {
          var parteDoDominio = partesDoDominio[indice];
  
          // Evitando @gmail...com
          if (parteDoDominio.length == 0) return false;  
  
          if (!/^[a-zA-Z0-9-]+$/.test(parteDoDominio))
              return false;
      }
  
      return true;
  }


 static getListaTiposIngresso(evento:Evento){
	var listaTiposIngresso: TipoIngresso[] = [];  

  var tipoIngresso: TipoIngresso = new TipoIngresso ;
  
  tipoIngresso.id = "1";
  tipoIngresso.evento_id = evento.id;  

  if (evento.permitir_nao_socio == 'Sim'){  
    tipoIngresso.descricao=  evento.titulo + " - " + Funcoes.INGRESSO_SOCIO_NOME;
    tipoIngresso.mensagem = Funcoes.INGRESSO_SOCIO_MENSAGEM;    
  }else{
    tipoIngresso.descricao=  evento.titulo;
    tipoIngresso.mensagem = Funcoes.INGRESSO_SOCIO_APENAS_MENSAGEM;    
  }

  tipoIngresso.valor = evento.valor_socio;
  tipoIngresso.tipo = 'S';
  tipoIngresso.qtd_ingresso = 0;
  listaTiposIngresso.push(tipoIngresso);		

  if (evento.permitir_nao_socio == 'Sim'){
    var tipoIngresso1: TipoIngresso = new TipoIngresso ;
    tipoIngresso1.id = "2";			
    tipoIngresso1.evento_id = evento.id;
    tipoIngresso1.descricao= evento.titulo + " - " +  Funcoes.INGRESSO_NAO_SOCIO_NOME;
    tipoIngresso1.mensagem = Funcoes.INGRESSO_NAO_SOCIO_MENSAGEM;
    tipoIngresso1.valor = evento.valor_nao_socio;
    tipoIngresso1.tipo = 'C';    
    tipoIngresso1.qtd_ingresso = 0;

    listaTiposIngresso.push(tipoIngresso1);
  }

  return listaTiposIngresso;

 } 

 static getListaTiposIngressoByLista(listaEventos:Evento[]){

  var listaTiposIngresso: TipoIngresso[] = [];  

  for (var i = 0; i < listaEventos.length; i++){

      const evento: Evento = listaEventos[i] ;
      const lstTemp = this.getListaTiposIngresso(evento);
      for (var ii = 0; ii < lstTemp.length; ii++){
        const tpIngresso: TipoIngresso = lstTemp[ii] ;
        listaTiposIngresso.push(tpIngresso);
      } 

  }

  return listaTiposIngresso;

 } 

 static getEvento(id: string, listaEventos:Evento[]){

  var evento!: Evento;
  for (var i = 0; i < listaEventos.length; i++){

      evento = listaEventos[i] ;
      if (evento.id == id){
         return evento; 
      }

  }
  return evento;

 } 

 static atualizarQtdIngressos(listaTiposIngresso: TipoIngresso[]){

  var lista: TipoIngresso[] = [] ;
  for (var i = 0; i < listaTiposIngresso.length; i++){

    var t: TipoIngresso = listaTiposIngresso[i] ;

    const campo: HTMLInputElement = <HTMLInputElement>(document.getElementById("qtd-"+ t.evento_id +"-" + t.id));
    var v1 = Number(campo.value);
    t.qtd_ingresso = v1;
    lista.push(t);
  }

  return lista;

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
    .map( (el: string | number) => +el )
    
  const toValidate = (pop: number) => cpf
    // Pegar Array de items para validar
    .filter((digit: any, index: number, array: string | any[]) => index < array.length - pop && digit)
    // Transformar digitos em números
    .map((el: string | number) => +el)
  
  const rest = (count: number, pop: number) => (toValidate(pop)
    // Calcular Soma dos digitos e multiplicar por 10
    .reduce((soma: number, el: number, i: number) => soma + el * (count - i), 0) * 10) 
    // Pegar o resto por 11
    % 11 
    // transformar de 10 para 0
    % 10
    
  return !(rest(10,2) !== validator[0] || rest(11,1) !== validator[1])
}



}


export class Alert {
	type!: string;
	message!: string;
}

export class TipoIngresso {
	id!: string;
  evento_id!: string;
  descricao!: string;
	valor!: number;
  qtd_ingresso: number = 0;
  mensagem!: string;
  pessoa!: Pessoa;    
  evento!: Evento;    
  tipo! : string;
  mesmoAnterior!: string;	
  status! : string;
  assinatura_eletronica!: string;
}
