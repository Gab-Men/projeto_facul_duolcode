# API inicial

Prefixo: `/api`. JSON como entrada e saída. Todas as rotas de usuários e recursos exigem `Authorization: Bearer <token>`, exceto cadastro/login e a verificação de saúde. Não compartilhe um token real em documentação.

| Método e rota | Entrada / saída |
|---|---|
| `GET /health` | Verifica conexão com banco; retorna `{ "status": "ok" }` |
| `POST /auth/register` | Entrada: name, email, password, cpf. Retorna usuário sem senha/hash e status 201 |
| `POST /auth/login` | Entrada: email, password. Retorna token e usuário |
| `GET /users/me` | Usuário associado ao token |
| `PUT /users/me` | Entrada: name, cpf, password. Todos obrigatórios. Rejeita email, id e campos desconhecidos |
| `GET /statistics/portfolio` | Exige sessão. Totais, média, mediana, desvio padrão populacional, maior participação, clientes e histograma da conta atual. Resposta sem cache |
| `GET /:recurso?page=1&pageSize=10` | `{ items, total, page, pageSize }`; pageSize entre 1 e 50 |
| `GET /:recurso/:id` | Registro pertencente ao usuário autenticado |
| `POST /:recurso` | Cria registro; status 201 |
| `PUT /:recurso/:id` | Substitui todos os campos editáveis; status 200 |
| `DELETE /:recurso/:id` | Exclui registro; status 204 sem corpo |

Recursos permitidos: `clientes`, `servicos`, `parceiros`, `projetos`.

| Recurso | Campos obrigatórios |
|---|---|
| Clientes | name, description, email |
| Serviços | name, description |
| Parceiros | name, description, website (http/https) |
| Projetos | name, description, clientId (inteiro positivo de cliente da própria conta) |

O servidor define id e ownerId. Nome: 2–120 caracteres; descrição: 2–1000. Senha: 8–128, com maiúscula, minúscula e número. CPF aceita pontuação e é armazenado apenas com dígitos. E-mail de login é normalizado para minúsculas.

Erros retornam `{ "message": "Mensagem amigável" }`: 400 dados inválidos, 401 sessão inválida, 404 registro ausente/inacessível, 409 conflito, 429 limite de tentativas e 500 falha inesperada. Não há exclusão de usuário nesta etapa.
