# DuolCode — base para desenvolvimento em dupla

Esta é uma **cópia independente** do site institucional, preparada para evoluir por etapas conforme a rubrica. A pasta original não foi modificada. Não houve publicação na internet nem cópia de credenciais, histórico Git ou configuração de hospedagem do projeto original.

## O que já tem código

- Site público original com início, serviços, quem somos, parceiros e contato.
- Área de gestão simples: cadastro de conta, login, logout e edição do próprio perfil.
- JWT, senha com hash scrypt e salt, CPF/e-mail/senha validados no front-end e no back-end.
- Quatro CRUDs: clientes, serviços, parceiros e projetos; cada projeto pertence a um cliente.
- Listagens paginadas e telas separadas de criação/edição.
- Cada usuário enxerga somente seus registros. Os dois integrantes podem desenvolver o mesmo código, mas contas distintas não compartilham dados nesta primeira versão.
- MySQL, Docker Compose e Nginx configurados em arquivos; apenas Nginx publica a porta 8080.
- Testes de regras e rotas, instruções para agentes e três skills específicas do projeto.

Os cadastros da área de gestão **ainda não alimentam as páginas públicas** de serviços e parceiros. Essa integração é uma próxima etapa intencional. Não há anexos, notificações, relatórios, permissões por cargo ou recursos comerciais extras.

## Começar pelo site visual, sem banco

Requisito: Node.js 22.18 ou superior.

Abra um terminal **nesta pasta**, a que contém este README:

```powershell
npm --prefix frontend ci
npm --prefix frontend run dev
```

Abra http://localhost:3000. As páginas públicas e os formulários aparecem; cadastro/login e dados precisam da API e do MySQL para funcionar. Não há login fictício ou sucesso simulado.

## Rodar o sistema completo

Requisitos: Node.js 22.18+ e Docker Desktop aberto, usando containers Linux.

Na pasta deste README:

```powershell
node scripts/setup-env.ts
docker compose up --build -d
```

O primeiro comando gera senhas e a chave JWT localmente, sem exibi-las e sem sobrescrever uma configuração existente. O segundo instala dependências dentro dos containers, cria o banco e inicia os serviços. A primeira execução pode demorar alguns minutos.

Abra **http://localhost:8080** e escolha **Área de gestão → Criar minha conta**. Não existe conta ou senha padrão. Use dados de teste válidos para a apresentação acadêmica; não use dados reais de terceiros.

Para acompanhar a inicialização:

```powershell
docker compose ps
docker compose logs --tail=60 backend
```

Para parar preservando os dados:

```powershell
docker compose down
```

O volume `mysql_data` preserva os registros. **Não acrescente `-v`** se quiser manter os dados. O script `database/init.sql` só é executado automaticamente na criação de um volume vazio. Alterações futuras no esquema devem usar migrações; não apague dados para atualizar o banco.

## Trabalhar no código

```text
DuolCode-base/
  frontend/
    app/                 Páginas públicas e rotas da área de gestão
    components/          Cabeçalho, rodapé e componentes de formulários/listagens
    contexts/            Usuário logado disponível globalmente
    lib/                 Cliente da API, tipos e validações
    public/              Imagens originais
  backend/
    src/
      domain/            Entidades, tipos e validações
      services/          Regras de autenticação e cadastros
      repositories/      Contratos e consultas ao MySQL
      errors/            Erros com mensagens controladas
      app.ts             Rotas e middleware
      server.ts          Conexão com banco e inicialização
    tests/               Testes com banco substituto em memória
  database/init.sql      Tabelas e relacionamentos
  nginx/default.conf     Encaminhamento de requisições
  docker-compose.yml     Serviços, redes e volume
  .agents/skills/        Três skills específicas
  docs/                  Etapas, rubrica e testes manuais
```

Para instalar e testar o back-end sem MySQL:

```powershell
npm --prefix backend ci
npm test
npm run build:api
npm run build:web
```

O teste usa repositórios em memória **apenas dentro dos testes**. A aplicação real usa MySQL.

Para desenvolver o conjunto completo nesta primeira etapa, faça mudanças e execute novamente `docker compose up --build -d`. O Compose usa builds de produção; não tem atualização automática ao salvar. Para estudar só as telas, use o modo visual acima.

Se preferirem rodar API e frontend fora do Docker, será necessário um MySQL local com o esquema de `database/init.sql`, credenciais no `.env` da raiz e porta 3306. Execute `npm --prefix backend run dev` e `npm --prefix frontend run dev` em dois terminais. Não exponha a porta do MySQL no Compose principal apenas para facilitar esse fluxo: a rubrica pede que somente Nginx fique exposto.

## Como dividir o trabalho

Comecem por [docs/ETAPAS.md](docs/ETAPAS.md). Façam alterações pequenas, cada pessoa em sua branch, e revisem o código uma da outra. Não foi criado um repositório remoto nem feito push.

- [Situação da rubrica](docs/RUBRICA.md)
- [Roteiro de validação com MySQL](docs/TESTE-MANUAL.md)
- [Rotas e campos da API](docs/API.md)

## Validação desta entrega

- Front-end compilado para produção.
- Back-end compilado com TypeScript estrito.
- 11 testes automatizados passaram, cobrindo autenticação, CPF, permissões por usuário, CRUDs, paginação, perfil e relacionamentos.
- Telas de login e cadastro inspecionadas no navegador.
- **Docker/MySQL/Nginx não executados aqui:** Docker não está disponível no computador de preparação. A integração SQL, a persistência após reinício e o isolamento de rede precisam ser conferidos seguindo o roteiro manual.
- Esta base não representa nota integral na rubrica. Consulte as pendências documentadas.

## Decisões simples desta base

O site usava Vinext/Cloudflare. Nesta cópia, as páginas foram reaproveitadas em Next.js com servidor Node para facilitar o conjunto front-end + API + MySQL + Nginx solicitado pela rubrica. Fontes usam alternativas locais; a compilação não depende de baixar fontes do Google.

O token fica no localStorage conforme a rubrica, com validade de duas horas. Recuperação de senha, confirmação de e-mail, revogação imediata de sessões e HTTPS para publicação ficam para etapas futuras; o ambiente desta entrega é local.

As regras em AGENTS.md orientam o agente e os arquivos ignore evitam incluir segredos por acidente. Elas **não bloqueiam tecnicamente** a leitura de arquivos por ferramentas com acesso à pasta. A proteção efetiva de `.env` deve ser configurada no ambiente do agente e comprovada separadamente.

Referências técnicas: [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting) e [tratamento de erros no Express 5](https://expressjs.com/en/5x/guide/error-handling/).
