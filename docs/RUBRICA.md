# Rubrica: evidências e limites

Status significa evidência disponível, não nota atribuída. Valores e critérios vêm do PDF entregue pelo usuário. Itens sem descrição não foram inventados.

## Sprint atual - 22/10/2026

Integrantes: Gabriel Barreto Men e Pedro Henrique Rossato. Veja docs/SPRINT.md e o PDF em output/pdf/entrega-sprint-duolcode.pdf.

| Critério da sprint | Evidência |
|---|---|
| Cadastro no back-end | Implementado e testado: schemas, 17 testes automatizados no conjunto e integração real via Nginx/MySQL; obrigatoriedade, CPF, e-mail, senha e duplicidade |
| Cadastro no front-end | Implementado e conferido no navegador: campos obrigatórios, CPF, senha, confirmação, mensagens e retorno ao login; cadastro e login reais |
| Análise descritiva | Implementada e testada: barras, histograma, métricas, interpretação, fonte e limites em /painel/estatisticas; dados SQL restritos à conta |
| Encapsulamento | #clients privado nativo, construção validada, estado interno congelado e cópias; testes de tentativa de alteração |
| Acesso controlado | Getters executam cálculos de negócio; indicadores não têm setters; toReport devolve cópias |
| Entrega | PDF com nomes completos, repositório, metodologia, exemplo simulado e instruções; envio das alterações ao GitHub depende da dupla |

## Demais itens do projeto

| Critério | Código nesta base | Situação |
|---|---|---|
| Back-end: autenticação (0,50) | E-mail e senha, regex, scrypt com salt, JWT, usuário existente | Implementado; testes de rotas em memória passaram; MySQL pendente |
| Back-end: cadastro (1,00) | Nome, e-mail, senha, CPF, obrigatoriedade e validação | Implementado e testado com MySQL |
| Back-end: edição (1,00) | `/users/me`, exige token, campos obrigatórios, CPF/senha, e-mail bloqueado | Implementado; integração real pendente |
| Back-end: quatro CRUDs (1,00) | Clientes, serviços, parceiros, projetos; autenticação; paginação; inexistentes; FK cliente/projeto | Implementado; SQL e concorrência precisam de validação real |
| Agentes (0,50) | AGENTS.md, três skills, instruções contra exposição de segredos e ações fora do escopo | Parcial: regras e exclusões não são um bloqueio técnico de leitura de .env |
| Front-end: autenticação (0,50) | Formulário, validação, localStorage, mensagens e redirecionamento | Implementado; teste completo com API/MySQL pendente |
| Front-end: cadastro (1,00) | Campos obrigatórios, confirmação de senha, CPF/e-mail, erros e retorno ao login | Implementado e conferido no navegador com API/MySQL |
| Front-end: edição (1,00) | AuthProvider, nome global, CPF, senha/confirmar, e-mail somente leitura | Implementado; teste completo com API/MySQL pendente |
| Front-end: CRUDs (1,00) | Listas paginadas, validações, criar/editar em rotas separadas | Implementado; fluxos de interface com banco real pendentes |
| Componentização (0,50) | Field, Feedback, AuthForm, RecordForm, RecordList, AdminShell e componentes públicos separados | Área de gestão organizada; ainda extrair seções internas das páginas públicas |
| Estatística: análise descritiva | Barras, histograma, métricas e metodologia com dados completos da conta | Implementado e testado; defesa preparada em docs/SPRINT.md |
| Encapsulamento (0,50) | Entity e PortfolioAnalysis protegem entrada, estado e saída | Implementado e testado |
| Acesso controlado (0,50) | Getters de cálculo em PortfolioAnalysis; relatório copiado, sem setters desnecessários | Implementado e testado |
| Modelagem/POO (0,50) | Entity, Project, contratos de repositórios e implementações intercambiáveis | Parcial: modelagem mínima; não há classe abstrata sem necessidade real |
| Tipagem avançada (0,50) | Interfaces, aliases, Page<T>, api<T>, tipos estritos, sem any explícito no código próprio | Base implementada; ainda pode evoluir com o domínio |
| SOLID (0,50) | Serviços dependem de contratos; MySQL e testes substituem persistência | Parcial: regras específicas e extensibilidade ainda simples; não declarar atendimento integral |
| Exceções/organização (0,50) | AppError, NotFoundError, middleware, domain/services/repositories | Base implementada; aprimorar nomenclatura/modelagem conforme acordo da dupla |
| Conexão com persona (0,50) | Gestão de clientes, serviços, parceiros e projetos de uma empresa digital | Plausível; falta validar necessidades e documentar persona |
| TypeScript sem JS injetado (0,50) | Código da aplicação em TS/TSX; scripts sem injeção em páginas | Evidência favorável; configuração PostCSS em MJS não é código injetado |
| Evolução: dois itens em branco (0,20 cada) | — | Esclarecer com professor |

## Cuidados com a evidência

- Não confundir teste com repositório em memória e teste de integração SQL.
- Não dizer que Docker funciona só porque existem Dockerfiles.
- Não apresentar AGENTS.md/.gitignore como isolamento de acesso ao sistema de arquivos.
- Os cadastros públicos continuam estáticos; o CRUD existe na área autenticada.
- Não adicione herança ou getters artificiais só para marcar uma caixa: modele uma regra concreta.

O ambiente Docker foi executado com os quatro serviços. As imagens compilaram e a integração da sprint passou na porta 8080. Somente Nginx tem porta publicada; MySQL permanece na rede interna. Essa infraestrutura é suporte à execução, sem atribuição de pontuação não descrita no PDF.

A persistência foi conferida reiniciando MySQL e backend e atualizando a análise da conta de demonstração. Resultados e imagens estão em docs/VALIDACAO-SPRINT.md.
