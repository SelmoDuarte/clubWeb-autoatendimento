import { Dependente } from "../dependentes/dependente";

export class Associado {
    idassociado: string ;
    titulo : string ;
    nome : string ;
    tratamento : string ;
    dtins : string ;
    matr : string ;
    dtdeslig : string ;
    dtmatr : string ;
    idcateg_soc : string ;
    idsituacao : string ;
    dtsituacao : string ;
    sexo : string ;
    naturalidade : string ;
    dtnasc : string ;
    endereco : string ;
    bairro : string ;
    idcidade : string ;
    cep : string ;
    tel1 : string ;
    tel2 : string ;
    tel3 : string ;
    email : string ;
    mes_aniv : string ;
    identidade : string ;
    idest_civil : string ;
    cpf : string ;
    envia_boleto : string ;
    nome_pai : string ;
    nome_mae : string ;
    via : string ;
    ativa_msg : string ;
    msg : string ;
    contador_msg : string ;
    dia_venc_cob : string ;
    dtultatu : string ;
    obs : string ;
    tel_trab : string ;
    ramal_trab : string ;
    endereco_cob : string ;
    bairro_cob : string ;
    idcidade_cob : string ;
    cep_cob : string ;
    endereco_com : string ;
    bairro_com : string ;
    idcidade_com : string ;
    cep_com : string ;
    email_com : string ;
    nacionalidade : string ;
    referencia : string ;
    ocupacao : string ;
    nome_emp : string ;
    renda : string ;
    bancos : string ;
    dt_val : string ;
    flg_temp : string ;
    idassoc_resp : string ;
    dtadm : string ;
    foto : string = '' ;
    flg_validade : string ;
    seq_matr : string ;
    flg_conselheiro : string ;
    idprofissao : string ;
    idsetor_cons : string ;
    idcondicao : string ;
    situacao_cons : string ;
    obs_cons : string ;
    flg_recad : string ;
    termo : string ;
    ac : string ;
    idlayout : string ;
    ag_val : string ;
    cc_cart : string ;
    orgao_emissor : string ;
    flg_isento : string ;
    flg_mes_seguinte : string ;
    extra : string ;
    msg_tela : string ;
    ativa_msg_tela : string ;
    idtipo_tel1 : string ;
    idtipo_tel2 : string ;
    idtipo_tel3 : string ;
    dt_recad : string ;
    idcargo_prof : string ;
    idescolaridade : string ;
    tp_end_corresp : string ;
    identif_prof : string ;
    data_vinculacao : string ;
    flg_bloquear_consumo : string ;
    mandato_fim_cons : string ;
    mandato_ini_cons : string ;
    mes_cob : string ;
    via_estac : string ;
    matr_estac : string ;
    idassoc_vinculado : string ;
    nome_abrev : string ;
    cpf_cc : string ;
    email_cc : string ;
    link_erp : string ;
    dtatu_auto : string ;
    flg_mes_anterior : string ;
    matr_opc : string ;
    idsituacao_retorno : string ;
    data_retorno_situacao : string ;
    flg_email_retorno_situacao_enviado : string ;
    idmod_email_retorno : string ;
    idempresa : string ;
    cart_trabalho : string ;
    tipo_orgao : string ;
    email_outros : string ;
    tipo_pessoa : string ;
    cnpj : string ;
    nomefam1emerg : string ;
    nomefam2emerg : string ;
    nomemedicoemerg : string ;
    conveniomedemerg : string ;
    hospitalemerg : string ;
    telfam1emerg : string ;
    telfam2emerg : string ;
    telmedicoemerg : string ;
    obsemergencia : string ;
    envia_boleto_email : string ;
    nome_cc : string ;
    flg_usar_cpf_cc : string ;
    envia_boleto_correspondencia : string ;
    idassoc_indicacao : string ;
    dtfalecimento : string ;
    flg_anonimizado : string ;
    flg_nao_calc_multa_juros : string ;
    idassoc_indicacao_2 : string ;
    idassoc_indicacao_3 : string ;
    idassoc_indicacao_4 : string ;
    cod_indentif_deb_auto : string ;
    extra_2 : string ;
    inscr_estadual : string ;
    inscr_municipal : string ;
    idclassposto : string ;
    id_parent_socio_vinc : string ;

    categoria_descricao: string;

    listaCartoesSocial: Cartao[];
    listaAcessosTemporario: AcessoTemporario[];
    listaCartoesEstacionamento: Cartao[];
    listaDependentes: Dependente[];
    listaFinanceiro: LancamentoDebito[];   
    listaAtividades:  Atividade[];

    spd: string;
   
}

export class Cartao {
    via: string;
    dt_pedido: string;
    dt_entrega: string;
    dt_impressao: string;
    dt_validade: string;
}

export class AcessoTemporario {
    dt_emissa: string;
    dt_ini_val: string;
    dt_fim_val: string;
}


export class Parentesco {
    id: string;
    descricao: string;
}

export class LancamentoDebito{

    idarrecad : string ;
    idassociado : string ;
    idcobr_assoc : string ;
    idcobranca : string ;
    idcategoria : string ;
    ano_mes : string ;
    valor : string ;
    juros : string ;
    descontos : string ;
    dtvenc : string ;
    dtpag : string ;
    estado : string ;
    idboleto : string ;
    flg_apagar : string ;
    flg_soc : string ;
    tpoutros : string ;
    idoutros : string ;
    matr_utiliz : string ;
    nome_utiliz : string ;
    idtitulo : string ;
    pag_link : string ;
    flg_parc : string ;
    flg_ger_unit : string ;
    idusuario_ins : string ;
    idusuario_quit : string ;
    idlink : string ;
    tplink : string ; 
    idparcelamento : string ;
    idforma_pag : string ;
    obs : string ;
    status : string ;
    num_banco : string ;
    idboleto_vir : string ;
    idboleto_2 : string ;
    dt_consumo : string ;
    idorigem_cob : string ;
    tporigem_cob : string ;
    qtd_consumo : string ;
    dt_real_pag : string ;
    flg_tipo_bol : string ;
    num_imp_rec : string ;
    num_imp_aut : string ;
    hist : string ;
    dt_insercao : string ; 
    idstatus : string ;
    idtppag : string ;
    idlayout : string ;
    tpboleto : string ;
    dtatu_auto : string ;
    idcobr_aluno : string ;
    dtvenc_orig : string ;
    dt_credito : string ;
    num_doc_cartao : string ;
    flg_import : string ;
    idhist_retorno : string ;
    obs_boleto : string ;
    idarrecad_taxa_adm : string ;
    idncc_det : string ;
    idncc : string ; 
    data_pagamento_ultima : string ;
    iddesc_assoc : string ;
    duplicata : string ;
    tppag : string ;
    link_erp : string ; 
    idboleto_3 : string ;
    flg_mes_anterior: string;    

    valor_total: string;
    tipo: string;
    categoria: string;

}

class Atividade{
    atividade_descricao: string;
    turma_descricao: string;
    dt_ini: string;
    dt_fim: string
    estado: string;
}