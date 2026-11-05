# Tech Forge: tipagem e organização do backend

Esta etapa fortalece os critérios de **Tipagem Avançada e Recursos do TypeScript** e **Tratamento de Exceções e Organização do Código**. A avaliação final depende da defesa e do professor; não representa conclusão automática dos demais critérios.

## Responsabilidades

| Local | Responsabilidade |
|---|---|
| `backend/src/app.ts` | Compor serviços, rotas e middlewares; receber dependências por contratos |
| `backend/src/http/` | Receber HTTP, validar parâmetros de rota/paginação e produzir respostas tipadas |
| `backend/src/domain/user.ts` | Modelos de usuário, dados públicos e sessão |
| `backend/src/domain/records.ts` | Recursos e tipos de entrada/registro derivados dos schemas |
| `backend/src/domain/pagination.ts` | Contrato genérico `Page<T>` |
| `backend/src/domain/validation.ts` | Schemas de entrada e regras de validação, com reexportações para compatibilidade |
| `backend/src/domain/entity.ts` e `portfolio-analysis.ts` | Estado protegido e regras de entidade/análise |
| `backend/src/services/` | Casos de uso; hash/verificação de senha em módulo próprio |
| `backend/src/repositories/contracts.ts` | Interfaces de persistência independentes do MySQL |
| `backend/src/repositories/mysql/` | Adaptadores separados para usuários, registros e estatística; validação de linhas do banco |
| `backend/src/errors/` | Exceções esperadas com classe própria |
| `backend/src/http/error-handler.ts` | Traduzir erros em respostas HTTP controladas |

Os arquivos `repositories/mysql.ts` e as reexportações em `domain/validation.ts` preservam importações existentes. Não existe uma segunda implementação nesses pontos.

## Evidências de tipagem em uso

- **Interfaces e aliases:** UserRepository, RecordRepository, StatisticsRepository, User, PublicUser, AuthSession e Resource.
- **Generics:** `Page<T>` conserva o tipo dos itens. `RecordInput<R>` e `BusinessRecord<R>` representam o recurso específico. `ApiHandler<T>` liga o corpo da resposta ao contrato da rota. O mapper SQL usa `fromRow<T>` para transformar uma entrada desconhecida em uma saída validada.
- **Tipos mapeados e inferência:** RecordInputMap deriva os campos dos schemas Zod; a declaração TypeScript não precisa repetir email, website ou clientId como opcionais para todos os recursos.
- **NoInfer:** create/update dos repositórios inferem o recurso pelo primeiro argumento. Por exemplo, `create("clientes", ownerId, dados)` exige email e `update("projetos", ownerId, id, dados)` exige clientId.
- **Utility types:** Omit e Pick separam dados novos, alteração de perfil e exposição pública. publicUser seleciona explicitamente os campos permitidos na resposta.
- **satisfies:** os metadados SQL precisam cobrir todos os recursos e só podem declarar colunas pertencentes ao tipo daquele recurso. Identificadores SQL vêm de listas fixas; valores continuam parametrizados.
- **unknown nas fronteiras:** corpos HTTP e linhas SQL são validados antes do uso. Não há `any` explícito nem casts de linhas SQL ou de sessão no código próprio do backend.
- **Opções rigorosas:** strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitOverride, noPropertyAccessFromIndexSignature, noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch, noEmitOnError e verbatimModuleSyntax.

## Exceções e validação

As regras da API continuam validadas no servidor. As classes AppError e NotFoundError representam falhas esperadas. O middleware central preserva as respostas 400, 401, 404 e 409, com mensagens controladas. Falhas inesperadas retornam 500 sem conteúdo interno.

Linhas do MySQL também são verificadas em tempo de execução. Dados incompatíveis do banco geram erro interno genérico, em vez de serem afirmados como User/BusinessRecord por um cast. Contagens aceitam números ou strings inteiras decimais, conforme o retorno do driver, e rejeitam null, booleanos, negativos e valores inseguros. Hash de senha malformado é recusado sem causar falha inesperada de login.

## Como validar e apresentar

Na raiz do projeto:

```powershell
npm test
npm run build:api
docker compose up --build -d backend
docker compose restart nginx
npm run verify:sprint
```

`npm test` primeiro verifica o código de produção e os contratos estáticos em `backend/tests/types/contracts.ts`, depois executa os testes de comportamento. Os casos com `@ts-expect-error` são compilados e nunca executados; se uma entrada inválida passar a ser aceita pelo TypeScript, essa verificação falha.

Os testes de comportamento usam repositórios em memória e validam também os mappers SQL e hashes malformados. A integração `verify:sprint` usa a API e o MySQL reais, cria contas/dados simulados e os mantém no banco. Diferencie essas evidências na apresentação.

Roteiro curto: mostrar um recurso com campo obrigatório no schema; mostrar o tipo inferido e a rejeição estática de campo ausente; seguir a chamada rota → serviço → contrato → adaptador; mostrar a validação da linha SQL; demonstrar um erro esperado e um erro interno sem vazamento de detalhes.

Frontend, AGENTS.md, skills e isolamento de segredos não foram modificados nesta etapa. Não foi criada herança, classe abstrata ou setter apenas para pontuar na rubrica.

## Verificação da etapa — 04/11/2026

- Verificação estática de produção e dos cinco casos negativos de contratos: aprovada.
- Suíte automatizada: 20 testes aprovados, incluindo os 17 existentes.
- Compilação local e construção da imagem Docker: aprovadas.
- `verify:sprint` com MySQL real: aprovado.
- Auditoria HTTP adicional de edição de perfil e CRUDs completos, paginação, autenticação, isolamento, recursos inexistentes e vínculo cliente/projeto: aprovada no Docker atualizado.
- Backend e banco saudáveis; página inicial em `http://localhost:8080` respondeu HTTP 200.

As verificações de integração criaram contas/dados simulados identificados como teste. Não houve remoção de dados anteriores. Nenhuma dependência foi adicionada ou atualizada nesta etapa.
