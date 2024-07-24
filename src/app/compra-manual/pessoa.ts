import { TipoIngresso } from "./Funcoes";

export class Pessoa {
    cpf: string = '';
    nome: string = '';
    posicao!: string;    
    data_nascimento: string = '';
    celular: string = '';
	email:string = '';
    operacao:string = '';
    evento_id: string = '';    
    id_cielo!: string;
    numero_titulo: string = '';
    titular: string = 'Sim';
    status!: string ;
    qtd_ingresso_socio!: number;
    qtd_ingresso_nao_socio!: number;
    categoria:string = '';
}

export interface Evento {
    id: string ;
    titulo: string;    
    descricao: string;
    status: string;    
    valor_socio: number;
    valor_nao_socio: number;    
    permitir_nao_socio: string;
    operacao: string;    
    banner: string;
    data_inicio: string;
    data_fim: string;
    qtd_maxima_participantes: string;
    senha:string;
    checkin : string;
    comprar_varios_ingressos : string;
    categorias: string;
}

export class Ingresso extends TipoIngresso {
    
}