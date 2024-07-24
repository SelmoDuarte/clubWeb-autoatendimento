export class BaixaColetivaAtividade {
    idatividade: string;
    idturma: string;
    ano_mes: string;
    idcobranca: string;
    idcategoria: string;
    valor: number;
    idusuario: string;
    data: string;

}

export class Aluno{
    nome: string;
    idarrecad: string;
    estado: string;
    tipo: string;
/*    
    tp_aluno: string;
    socio_nome: string;
    socio_id: string;
    dependente_nome: string;
    dependente_id: string;
    nao_socio_nome: string;
    nao_socio_id: string;
*/
    selecionado: boolean = false;
}
