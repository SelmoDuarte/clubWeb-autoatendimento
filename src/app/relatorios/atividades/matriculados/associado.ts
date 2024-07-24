
export class Associado {
    nome: string = '';
    id: string = '';
    tp_aluno: string = '';
    idassociado: string = '';
    matr: string;
    titulo: string;
    turma: string;
    debitos: string;
    listaDebitos: Debito[];

    layout: string;
}

export class Debito {
    ano_mes: string;
    valor: string;
    descricao: string;
    categoria: string;
}
