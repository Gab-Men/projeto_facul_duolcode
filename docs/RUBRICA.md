# Rubrica: implementação inicial e limites

Status significa evidência disponível, não nota atribuída. Valores e critérios vêm do PDF entregue pelo usuário. Itens sem descrição não foram inventados.

| Critério | Código nesta base | Situação |
|---|---|---|
| Back-end: autenticação (0,50) | E-mail e senha, regex, scrypt com salt, JWT, usuário existente | Implementado; testes de rotas em memória passaram; MySQL pendente |
| Back-end: cadastro (1,00) | Nome, e-mail, senha, CPF, obrigatoriedade e validação | Implementado; integração real pendente |
| Back-end: edição (1,00) | `/users/me`, exige token, campos obrigatórios, CPF/senha, e-mail bloqueado | Implementado; integração real pendente |
| Back-end: quatro CRUDs (1,00) | Clientes, serviços, parceiros, projetos; autenticação; paginação; inexistentes; FK cliente/projeto | Implementado; SQL e concorrência precisam de validação real |
| Agentes (0,50) | AGENTS.md, três skills, instruções contra exposição de segredos e ações fora do escopo | Parcial: regras e exclusões não são um bloqueio técnico de leitura de .env |
| Front-end: autenticação (0,50) | Formulário, validação, localStorage, mensagens e redirecionamento | Implementado; teste completo com API/MySQL pendente |
| Front-end: cadastro (1,00) | Campos obrigatórios, confirmação de senha, CPF/e-mail, erros e retorno ao login | Implementado; teste completo com API/MySQL pendente |
| Front-end: edição (1,00) | AuthProvider, nome global, CPF, senha/confirmar, e-mail somente leitura | Implementado; teste completo com API/MySQL pendente |
| Front-end: CRUDs (1,00) | Listas paginadas, validações, criar/editar em rotas separadas | Implementado; fluxos de interface com banco real pendentes |
| Componentização (0,50) | Field, Feedback, AuthForm, RecordForm, RecordList, AdminShell e componentes públicos separados | Área de gestão organizada; ainda extrair seções internas das páginas públicas |
| Compose (0,50) | Serviços, variáveis, volumes e redes declarados | Configurado, não executado neste ambiente |
| Integração (0,50) | Nginx → frontend/backend; backend → MySQL | Configurado, falta testar execução conjunta |
| Persistência MySQL (0,50) | Volume mysql_data | Configurado, falta testar reinício |
| Nginx (1,50) | `/api/` para API; demais rotas para frontend | Configurado, falta validar via porta 8080 |
| Docker Network (1,00) | Somente Nginx publica porta; MySQL em rede interna separada | Configurado, falta verificar containers |
| DevOps: item sem descrição (0,50) | — | Esclarecer com professor |
| Encapsulamento (0,50) | Entity copia entrada e saída; propriedades privadas; dependências privadas nos serviços | Base implementada e testada; evoluir modelagem com regras do produto |
| Acesso controlado (0,50) | Snapshot em vez de estado mutável exposto | Parcial: não há getters/setters com regras de negócio; discutir aplicação legítima |
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
