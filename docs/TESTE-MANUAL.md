# Validação com banco real

Use o ambiente local e dados de teste. Esta lista ainda precisa ser executada pela dupla em uma máquina com Docker.

1. Execute os dois comandos de inicialização do README e espere os serviços ficarem saudáveis.
2. Abra `http://localhost:8080`; confira as cinco páginas públicas e o link Área de gestão.
3. Cadastre uma conta: rejeite CPF inválido, e-mail inválido, senha fraca e confirmação diferente. Confirme redirecionamento ao login no sucesso.
4. Entre com senha incorreta e depois correta. Confira mensagem de erro e acesso ao painel.
5. Cadastre um cliente, um serviço, um parceiro e um projeto vinculado ao cliente. Atualize o navegador: os registros devem permanecer.
6. Edite e exclua registros de cada tipo. Um cliente com projeto vinculado deve produzir mensagem de conflito; exclua o projeto antes do cliente.
7. Cadastre 11 serviços; verifique a segunda página e a volta à página anterior após excluir o único registro da última página.
8. Edite o perfil com nome, CPF e senha. O e-mail não pode mudar; o nome do cabeçalho deve atualizar. Confira login com a nova senha.
9. Saia. Visitar `/painel` deve levar ao login.
10. Cadastre uma segunda conta com outro CPF/e-mail. Ela não deve listar ou acessar registros da primeira, mesmo tentando os identificadores diretamente pela API.
11. Confirme respostas 401 para requisições sem token e 404 para registro inexistente. Confira a mesma proteção em todos os quatro recursos.
12. Execute `docker compose down` e depois `docker compose up -d`. Entre novamente e confira os dados anteriores.
13. Em `docker compose ps`, apenas Nginx deve ter porta publicada no host. MySQL deve participar somente da rede de dados interna.
14. Confira formulários e tabelas em celular, teclado e mensagens de erro quando a API estiver indisponível.

Não execute comandos que imprimam o conteúdo do `.env` ou a configuração interpolada com senhas. Não use `docker compose down -v` durante o teste de persistência.

Registre o resultado real, a data, quem testou e qualquer falha encontrada. Se algum passo falhar, não marque o critério correspondente como concluído.
