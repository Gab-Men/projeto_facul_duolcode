# DuolCode — trabalho em dupla

## Escopo
Este é o projeto de estudo em etapas. Preserve o site público e desenvolva apenas a etapa solicitada. Não publique o site nem modifique a pasta original de onde esta cópia veio.

## Organização
- `frontend/app`: rotas; `frontend/components`: componentes; `frontend/contexts`: sessão.
- `backend/src/domain`: entidades e validação; `services`: regras; `repositories`: persistência.
- MySQL é o banco real. Repositórios em memória existem apenas nos testes.
- Quatro recursos: clientes, serviços, parceiros e projetos. Usuários não contam como um CRUD da rubrica.
- Listagem e formulário ficam em rotas separadas. Toda rota de negócio exige autenticação.
- Registros pertencem ao usuário autenticado; não receba ownerId do navegador.

## Guardrails
- Não leia, liste valores, copie ou exponha `.env`, `.env.*` (exceto `.env.example`), chaves privadas ou credenciais. Não execute comandos que imprimam o ambiente ou a configuração resolvida do Compose.
- Para diagnosticar configuração, confirme somente a presença das variáveis; nunca seus valores.
- Não registre senhas, tokens, CPF completo ou corpos de autenticação em logs.
- Não execute limpeza de volumes, exclusão de banco, reset de Git ou publicação sem pedido explícito.
- Não remova autenticação, validações ou testes para fazer uma alteração passar.
- Não adicione dependências, telas ou padrões complexos fora do escopo necessário.
- Rode os testes do backend e a compilação relevante ao concluir uma mudança funcional.

## Skills deste projeto
Use os arquivos correspondentes em `.agents/skills` quando a tarefa se aplicar:
- `duolcode-api`: endpoints, domínio e banco.
- `duolcode-interface`: telas, sessão e formulários.
- `duolcode-rubrica`: conferência por evidência e divisão em etapas.

## Bloqueio técnico de segredos
- `.agents/claude-settings.json` (instalado em `.claude/settings.json` com `npm run setup:agents`) nega leitura/edição de `.env` e chaves, e comandos como `printenv` e `docker compose config`.
- `.agents/hooks/protect-secrets.ts` (PreToolUse) recusa qualquer ferramenta cujo caminho ou comando aponte para `.env`/chaves ou imprima o ambiente.
- `.cursorignore`, `.aiexclude`, `.geminiignore`, `.codeiumignore` e `.aiderignore` excluem os mesmos arquivos em outras ferramentas.
- Comprovação: `npm run verify:agents`. Não remova nem enfraqueça essas proteções.
- Limite: ferramentas que ignoram hooks e arquivos de exclusão continuam dependendo destas regras; para máxima garantia, rode o agente numa cópia sem o `.env` real.
