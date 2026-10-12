# Evolução em dupla

A base já contém código executável para os fluxos principais. O objetivo agora é entender, validar e melhorar uma parte por vez; não desenvolver todas as melhorias de uma vez.

| Etapa | Pessoa A | Pessoa B | Critério para encerrar |
|---|---|---|---|
| 1. Conhecer e executar | Ler README e mapear rotas/telas | Ler esquema SQL e serviços | Os dois conseguem explicar o caminho tela → API → banco e rodar o conjunto |
| 2. Usuários | Revisar login, cadastro, contexto e perfil | Revisar JWT, hash e validações | Cadastro, login, edição e erros demonstrados com banco real |
| 3. Clientes e serviços | Aperfeiçoar formulários e listagens | Conferir regras, consultas e paginação | Criar, listar, editar e excluir; outra conta não acessa os dados |
| 4. Parceiros e projetos | Melhorar seleção de cliente e mensagens | Conferir vínculo projeto/cliente e exclusões | Projeto exige cliente e exclusões relacionadas têm mensagem clara |
| 5. Organização | Extrair seções das páginas institucionais | Refinar entidades, contratos e erros | Ambos explicam as responsabilidades e evitam abstrações sem uso real |
| 6. Infraestrutura | Validar navegação via Nginx | Validar MySQL, volume e redes | Somente porta do Nginx exposta; dados sobrevivem a reinício |
| 7. Rubrica e apresentação | Preparar demonstração das telas | Reunir evidências das regras e infraestrutura | Revisão cruzada de todos os critérios, inclusive pendências |

Troquem de função em pelo menos uma etapa, para ambos entenderem front-end e back-end. A divisão é uma sugestão, não uma restrição de acesso ao código.

## Rotina de colaboração

1. Escolham uma tarefa pequena e escrevam o comportamento esperado.
2. Criem branches descritivas, como `feat/validacao-clientes` e `feat/tela-projetos`.
3. Combinem mudanças em arquivos compartilhados: esquemas, API, CSS global e Compose.
4. Quem altera a API avisa o formato de entrada, saída e erros antes de a outra pessoa mudar a tela.
5. Rodem os testes e a compilação relevante.
6. A outra pessoa revisa e executa o fluxo; depois integrem a branch.

O projeto foi entregue sem Git inicializado para vocês escolherem onde hospedá-lo. A inicialização, o remoto e os convites à dupla são uma etapa separada.

## Melhorias que podem esperar

- Tornar públicas as listagens de serviços/parceiros com regras específicas, sem expor cadastros privados.
- Compartilhar um espaço de trabalho entre contas da equipe, caso esse seja o produto desejado.
- Adicionar busca, filtros, status de projeto e paginação na seleção de clientes.
- Criar migrações de banco e testes de integração automatizados com MySQL.
- Refinar classes, getters com regras reais e princípios SOLID conforme discussão com o professor.
- Preparar publicação com HTTPS e políticas de sessão adequadas.
