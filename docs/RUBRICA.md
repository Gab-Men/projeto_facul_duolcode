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

## Demais itens do projeto — atualizado em 08/11/2026

Comandos de evidência: `npm test` (27 testes, sem banco), `npm run verify:rubrica` (19 verificações na API + MySQL reais), `npm run verify:sprint`, `npm run verify:agents` (bloqueio de segredos).

| Critério | Código nesta base | Situação |
|---|---|---|
| Back-end: autenticação (1,00) | E-mail e senha, regex, scrypt com salt, JWT, usuário existente | Implementado e testado em memória e com MySQL real (`verify:rubrica`) |
| Back-end: cadastro (1,00) | Nome, e-mail, senha, CPF, obrigatoriedade, CPF/senha/e-mail validados | Implementado e testado com MySQL |
| Back-end: edição (1,00) | `/users/me`, exige token, campos obrigatórios, CPF/senha, e-mail rejeitado (schema strict) | Implementado e testado com MySQL |
| Back-end: quatro CRUDs (0,50) | Clientes, serviços, parceiros, projetos; autenticação; paginação; 404 em inexistentes; FK projeto→cliente; 409 ao excluir cliente com projetos; isolamento por conta | Implementado e testado com MySQL |
| Agentes (0,50) | AGENTS.md, 3 skills, guardrails, **bloqueio técnico**: `.claude/settings.json` (deny) + hook `.agents/hooks/protect-secrets.ts` + arquivos de exclusão para Cursor/Gemini/Codeium/Aider | Implementado; `npm run setup:agents` instala e `npm run verify:agents` comprova o bloqueio |
| Front-end: autenticação (0,50) | Formulário, regex, localStorage, mensagens da API, redirecionamento | Conferido no navegador com API/MySQL |
| Front-end: cadastro (1,00) | Campos obrigatórios, confirmação de senha, CPF/e-mail, erros da API, volta ao login | Conferido no navegador com API/MySQL |
| Front-end: edição (1,00) | AuthProvider (nome global no cabeçalho), CPF, checklist de nível de senha, confirmação, e-mail somente leitura | Conferido no navegador |
| Front-end: CRUDs (1,00) | Listas paginadas (componente `Pagination`), coluna específica por recurso (cliente do projeto pelo nome), validação, criar/editar em rotas separadas | Conferido no navegador |
| Componentização (0,50 + 0,50) | `components/site/` (SitePage, PageHero, SectionHeading, FeatureCard, CheckList, NumberedSteps, PartnerCard) e `components/admin/` (Field, Feedback, Pagination, PasswordRules, RecordForm, RecordList, gráficos); seções de cada página em funções separadas | Implementado |
| Estatística: análise descritiva (1,00) | Barras, histograma, **Pareto (colunas + linha acumulada)**; média, mediana, desvio padrão, **quartis, coeficiente de variação, top 20%** | Implementado e testado |
| Encapsulamento (0,50) | `#state`/`#clients` privados nativos e congelados, construtores validados, cópias na saída | Implementado e testado |
| Acesso controlado (0,50) | Getters só para cálculos/regras (`relations`, `quartiles`, `coefficientOfVariation`…); nenhum setter | Implementado e testado |
| Modelagem/POO (0,50) | `abstract class BusinessEntity` + `ClientEntity`, `ServiceEntity`, `PartnerEntity`, `ProjectEntity`; Template Method (hooks `normalize`/`validate`); polimorfismo em `relations` e `resource` | Implementado e testado (`tests/domain.test.ts`) |
| Tipagem avançada (0,50) | Interfaces, aliases, Generics (`Page<T>`, `BusinessEntity<R>`, `parseRecord<R>`, `createEntity<R>`), tipos mapeados, sem `any` | Implementado; contratos verificados em `tests/types` |
| SOLID (0,50) | S: serviço/repositório/entidade separados; O: fábrica de entidades — novo recurso não altera o serviço; L: qualquer `BusinessEntity` substitui a base; D: serviços dependem de contratos | Implementado |
| Exceções/organização (0,50) | `AppError` → `ValidationError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`; middleware central; pastas domain/services/repositories/http/errors | Implementado e testado |
| Conexão com persona (0,50) | docs/PERSONA.md liga cada funcionalidade a uma necessidade do cliente | Documentado; dupla deve validar os detalhes |
| TypeScript sem JS injetado (0,50) | Todo o código-fonte em TS/TSX (backend, frontend, scripts e hook do agente); config do PostCSS em JSON; nenhum `.js`, `<script>` ou `dangerouslySetInnerHTML` no código | Atende |
| Evolução: dois itens em branco (0,20 cada) | — | Esclarecer com professor |

## Cuidados com a evidência

- Não confundir teste com repositório em memória e teste de integração SQL.
- Não dizer que Docker funciona só porque existem Dockerfiles.
- AGENTS.md e .gitignore são orientações; o bloqueio técnico está em `.claude/settings.json` + hook. Ferramentas sem suporte a hooks dependem dos arquivos de exclusão.
- O limite de 30 tentativas de login/cadastro por 15 minutos vale também para os scripts: se aparecer 429, reinicie o backend (`docker compose restart backend`) antes de rodar outra verificação.
- Os cadastros públicos continuam estáticos; o CRUD existe na área autenticada.
- Não adicione herança ou getters artificiais só para marcar uma caixa: modele uma regra concreta.

O ambiente Docker foi executado com os quatro serviços. As imagens compilaram e a integração da sprint passou na porta 8080. Somente Nginx tem porta publicada; MySQL permanece na rede interna. Essa infraestrutura é suporte à execução, sem atribuição de pontuação não descrita no PDF.

A persistência foi conferida reiniciando MySQL e backend e atualizando a análise da conta de demonstração. Resultados e imagens estão em docs/VALIDACAO-SPRINT.md.
