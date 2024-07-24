export class Evento {
    id: string = '';
    nome: string = '';    
    status: string = '';    
    valor_socio!: number;
    valor_nao_socio!: number;    
    permitir_nao_socio: string = 'Sim';
    permitir_inadimplente: string;
    operacao: string = '';    
    banner: string = '';
    data_inicio!: string;
    data_fim!: string;
    qtd_maxima_participantes!: string;
    senha!:string;
    checkin! : string;
    comprar_varios_ingressos : string = 'Sim';
    categorias: string = '';
    tipo_cobranca = '';
    categoria = '';
}

