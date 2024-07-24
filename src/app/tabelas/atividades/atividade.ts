import { Turma } from "../turmas/turma";

export class Atividade {
    idatividade: string = null;    
    nome: string = null;    
    obs: string = null;    
    estado: string = null;

    listaTurmas: Turma[];
}