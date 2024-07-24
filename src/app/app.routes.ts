import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guards';
import { ParticipantesComponent } from './participantes/participantes.component';
import { EventosComponent } from './eventos/eventos.component';
import { SorteioComponent } from './eventos/futebol/sorteio/sorteio.component';
import { CompraManualComponent } from './compra-manual/compra-manual.component';

import { AssociadosComponent } from './associados/associados.component';
import { TabelaListaAtividadesComponent } from './tabelas/atividades/atividades.component';
import { TabelaListaProfessoresComponent } from './tabelas/professores/professores.component';
import { RelatorioFinanceiroResumoCaixaComponent } from './relatorios/financeiro/resumo-caixa/resumo-caixa.component';
import { RelatorioFinanceiroAtividadesComponent } from './relatorios/financeiro/atividades/atividades.component';
import { RelatorioAtividadesMatriculadosComponent } from './relatorios/atividades/matriculados/matriculados.component';
import { TabelaListaCobrancasComponent } from './tabelas/cobrancas/cobranca.component';
import { RelatorioAssociadosConvenioComponent } from './relatorios/associados/convenios/associados-convenio.component';

export const routes: Routes = [
    {'path': 'eventos', title: 'Tabela . Eventos', component : EventosComponent, canActivate: [AuthGuard]},
    {'path': 'home', title: 'Home ', component : AssociadosComponent, canActivate: [AuthGuard]},
    {'path': 'relatorio/associados/convenio', title: 'Relatório -> Associados -> Convenio ', component : RelatorioAssociadosConvenioComponent, canActivate: [AuthGuard]},    
    {'path': 'relatorio/atividades/matriculados', title: 'Relatório -> Atividades -> Matriculados ', component : RelatorioAtividadesMatriculadosComponent, canActivate: [AuthGuard]},
    {'path': 'relatorio/financeiro/atividades', title: 'Relatório -> Atividades ', component : RelatorioFinanceiroAtividadesComponent, canActivate: [AuthGuard]},    
    {'path': 'relatorio/financeiro/resumo-caixa', title: 'Relatório -> Financeiro -> Resumo Caixa ', component : RelatorioFinanceiroResumoCaixaComponent, canActivate: [AuthGuard]},
    {'path': 'tabelas/atividade', title: 'Tabelas -> Atividade ', component : TabelaListaAtividadesComponent, canActivate: [AuthGuard]},
/*    {'path': 'tabelas/turmas', title: 'Tabelas -> Atividades -> Turmas ', component : TabelaListaTurmasComponent, canActivate: [AuthGuard]},    */
    {'path': 'tabelas/professores', title: 'Tabelas -> Professores ', component : TabelaListaProfessoresComponent, canActivate: [AuthGuard]},
    {'path': 'tabelas/cobranca', title: 'Tabelas -> Cobrancas ', component : TabelaListaCobrancasComponent, canActivate: [AuthGuard]},    
    {'path': 'geral/:tipo', title: 'Participantes', component : ParticipantesComponent, canActivate: [AuthGuard]},
    {'path': 'login', title: 'Login', component : LoginComponent},
    {'path': 'sorteio', title: 'Sorteio', component : SorteioComponent, canActivate: [AuthGuard]},
    {'path': 'compra-manual', title: 'Compra Manual', component : CompraManualComponent, canActivate: [AuthGuard]},
    {path: "**", component: LoginComponent }
];
