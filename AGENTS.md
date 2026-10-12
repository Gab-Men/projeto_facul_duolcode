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

## Limite real
Estas regras orientam o agente; não são uma barreira de sistema operacional. `.gitignore` e `.dockerignore` evitam inclusão acidental, mas não proíbem leitura por ferramentas. Para comprovar bloqueio técnico de segredos na rubrica, configure um ambiente de agente sem acesso ao arquivo real. Não declare este item como integralmente atendido só por este documento.
