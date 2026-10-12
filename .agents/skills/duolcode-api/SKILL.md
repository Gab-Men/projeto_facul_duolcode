---
name: duolcode-api
description: Implementar ou revisar endpoints, entidades e persistência da API DuolCode seguindo a rubrica.
---

Leia `backend/src/app.ts` e o serviço do recurso antes de alterar contratos. Use os repositórios por interface; não faça SQL dentro de rotas ou componentes. Campos SQL dinâmicos devem vir exclusivamente das listas fixas no código. Preserve escopo por ownerId e FK composta entre projetos e clientes. Valide dados com os schemas e retorne AppError para erros esperados. Não leia .env; use apenas .env.example. Rode `npm --prefix backend test` e `npm --prefix backend run build`. Informe separadamente testes em memória e integração real com MySQL.
