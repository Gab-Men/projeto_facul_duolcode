# DuolCode

Projeto acadêmico de **Gabriel Barreto Men e Pedro Henrique Rossato**.

Site institucional com área de gestão autenticada, cadastro de usuários, quatro CRUDs e análise descritiva da carteira de clientes.

## Executar com Docker

Requisitos: Docker Desktop aberto com containers Linux e Node.js 22.18 ou superior para os scripts locais. Abra um terminal na pasta deste README:

```powershell
node scripts/setup-env.ts
docker compose up --build -d
docker compose ps
```

Acesse **http://localhost:8080**. Escolha Área de gestão → Criar minha conta. Não existe usuário padrão. O cadastro exige nome, e-mail, CPF válido de teste e senha de 8 a 128 caracteres com maiúscula, minúscula e número.

O script de configuração preserva o .env existente e não exibe credenciais. O Docker instala as dependências e inicia Nginx, frontend, backend e MySQL. Na primeira execução o download e a compilação podem demorar.

Para parar e voltar, preservando os dados:

```powershell
docker compose stop
docker compose start
```

Depois de alterar o código, execute novamente `docker compose up --build -d`.

**[Passo a passo do Docker e diagnóstico](docs/DOCKER.md)**

## O que está implementado

- Cadastro com nome, e-mail, senha e CPF; validações no front-end e no back-end; confirmação de senha e retorno ao login.
- Senhas com scrypt e salt aleatório; login com JWT; contexto do usuário e edição do próprio perfil.
- CRUDs de clientes, serviços, parceiros e projetos, com autenticação, paginação, rotas separadas e vínculo projeto/cliente.
- Dados isolados por conta; o navegador não escolhe ownerId.
- Estatísticas da carteira: barras por cliente, histograma, totais, média, mediana, desvio padrão populacional e maior participação.
- Modelagem da análise com campo privado nativo, construtor validado, getters de cálculo e cópias para proteger o estado.
- MySQL com volume persistente e rede interna; somente Nginx publica a porta 8080.

As estatísticas aparecem em **Painel → Estatísticas**. Use clientes e projetos da sua conta; não existem valores fictícios preenchidos automaticamente. Consulte a base simulada de apresentação e as fórmulas em [docs/SPRINT.md](docs/SPRINT.md).

Os registros privados de serviços/parceiros ainda não alimentam as páginas públicas. Esse comportamento é uma etapa futura.

## Verificar

Para testes de domínio/API sem banco real:

```powershell
npm --prefix backend ci
npm test
npm run build:api
```

Para compilar o frontend fora do Docker:

```powershell
npm --prefix frontend ci
npm run build:web
```

Para testar a API real com MySQL, depois de subir o Docker:

```powershell
npm run verify:sprint
```

O último comando cria contas isoladas e dados simulados de verificação. Ele testa cadastro, validações, restrições de duplicidade, estatísticas e isolamento. Não imprime senhas, tokens ou CPF; não substitui a conferência dos formulários no navegador.

## Organização e entrega

- frontend/app: páginas; frontend/components/admin: formulários e gráficos; frontend/contexts: sessão.
- backend/src/domain: validação, entidades e cálculos; services: regras; repositories: contratos e SQL.
- database/init.sql: tabelas e relacionamentos existentes; as estatísticas não exigem mudança do esquema.
- [Detalhes da sprint e roteiro de defesa](docs/SPRINT.md)
- [Rotas da API](docs/API.md)
- [Rubrica e evidências](docs/RUBRICA.md)
- [Roteiro manual](docs/TESTE-MANUAL.md)
- [Resultados e imagens da validação](docs/VALIDACAO-SPRINT.md)
- [PDF de entrega](output/pdf/entrega-sprint-duolcode.pdf)

Repositório: https://github.com/Gab-Men/projeto_facul_duolcode

As alterações locais precisam ser revisadas e enviadas ao GitHub antes da entrega. A aplicação é executada localmente; abrir localhost:8080 não publica um site na internet.

## Cuidados com dados

Não envie .env ao GitHub ou ao professor. Não remova o volume mysql_data para atualizar o projeto. `docker compose down` preserva os registros; a opção -v remove o volume.

AGENTS.md e os arquivos ignore orientam o uso e evitam inclusão acidental de segredos, mas não bloqueiam tecnicamente acesso de ferramentas ao sistema de arquivos. A rubrica completa possui itens de outras etapas; este incremento se concentra na sprint descrita em docs/SPRINT.md.
