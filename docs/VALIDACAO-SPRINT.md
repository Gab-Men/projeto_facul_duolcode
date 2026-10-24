# Evidências de validação - 22/10/2026

Verificação local do incremento de cadastro, análise descritiva e encapsulamento.

| Verificação | Resultado observado |
|---|---|
| npm test | 17 testes passaram, nenhum falhou |
| npm run build:api | Compilação TypeScript concluída |
| npm run build:web | Compilação Next.js 16.4.2 concluída |
| Auditoria de dependências | Zero vulnerabilidades informadas após a atualização; npm ci nas imagens também informou zero |
| docker compose up --build -d | Imagens de produção construídas e quatro serviços em execução |
| Saúde | MySQL e backend saudáveis; frontend e Nginx em execução |
| Exposição de portas | Somente Nginx publica 8080; MySQL fica na rede interna |
| npm run verify:sprint | Cadastro real, campos obrigatórios, validações, duplicidades de e-mail/CPF, estatísticas SQL e isolamento aprovados |
| Navegador: cadastro | Cinco campos obrigatórios; CPF inválido, senha fraca e confirmação divergente rejeitados; cadastro válido levou ao login com confirmação; login abriu o painel |
| Navegador: análise vazia | Conta sem clientes recebeu estado vazio e indicadores derivados sem dados |
| Navegador: base simulada | Cinco clientes e dez projetos cadastrados pela interface; indicadores 2, 2, 1,41 e 40% exibidos |
| Persistência | MySQL e backend reiniciados; atualizar a análise manteve os cinco clientes e dez projetos da conta de demonstração |
| Celular | Página conferida com largura de 390 px; largura do documento igual à janela, sem transbordamento horizontal |
| PDF | Três páginas renderizadas e inspecionadas; nomes completos, repositório, metodologia e instruções presentes |

Imagens da conta de demonstração com dados simulados:

- [Estatísticas no computador](evidencias/estatisticas-desktop.png)
- [Estatísticas no celular](evidencias/estatisticas-celular.png)

Os testes de API usam repositórios em memória; o comando verify:sprint usa Nginx, API e MySQL reais. A conferência do navegador é separada. Os testes criaram contas isoladas com registros claramente simulados; nenhum dado de negócio existente foi apagado.

Essas evidências não atribuem nota nem substituem a defesa técnica. As alterações estão na pasta local: fazer commit/push da versão revisada e verificar acesso do professor são etapas da entrega.
