export class Registro {
    idrecibo: string;
    idassociado: string;
    idboleto: string;
    titulo: string;
    nome: string;
    idtppag: string;
    dtvenc: string;
    dtpag: string;
    ano_mes: string;
    juros: string;
    descontos: string;
    valor: string;
    total: number;    
    total_formatado: string;

    cobranca: string;
    categoria: string;
    tipo_pagamento_descricao: string;
    usuario_nome: string;


    listaLancamentos : Registro[];
    listaCategorias : Registro[];

}

export class RegistroTotal{
    valor_dinheiro;
    valor_cheque;
    valor_cartao;
    valor_cheque_pre;
    valor_deposito_bancario;
    valor_compensacao;
    valor_pix;
    valor_retorno_banco;
    valor_auto_atendimento;
}