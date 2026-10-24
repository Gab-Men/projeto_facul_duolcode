# Sprint: cadastro, análise descritiva e encapsulamento

**Integrantes:** Gabriel Barreto Men e Pedro Henrique Rossato.

**Repositório:** https://github.com/Gab-Men/projeto_facul_duolcode

Este documento cobre os itens da sprint informados pelo aluno. A rubrica completa contém outras etapas; esta entrega não representa conclusão automática de todos os itens do semestre.

## Cadastro no back-end

- Rota: POST /api/auth/register.
- Nome, e-mail, senha e CPF obrigatórios, validados com schemas Zod.
- CPF: quantidade de dígitos, sequências repetidas e dois dígitos verificadores. Aceita a formatação usual, rejeita letras.
- E-mail: regex, remoção de espaços nas extremidades e normalização para minúsculas.
- Senha: 8 a 128 caracteres, maiúscula, minúscula e número.
- A senha é armazenada como hash scrypt com salt aleatório; não é retornada na resposta.
- E-mail e CPF têm restrições UNIQUE no MySQL. Duplicidades recebem HTTP 409.
- Erros esperados têm mensagens controladas; detalhes internos não são enviados ao navegador.

## Cadastro no front-end

O formulário em /cadastro exige os quatro campos e confirmação de senha. A validação local dá retorno antes de enviar; o servidor repete a validação para proteger a API contra requisições diretas.

Depois da resposta 201, o navegador abre /login?cadastro=ok e mostra a confirmação. Erros da API aparecem no formulário; falhas de conexão recebem uma mensagem em português.

O front-end não envia a confirmação da senha para o banco: compara os dois valores antes de enviar a senha.

## Análise descritiva

**Pergunta de negócio:** como a quantidade de projetos se distribui entre os clientes da DuolCode?

**Objetivo:** apoiar acompanhamento comercial e percepção de concentração em volume de projetos.

**Fonte:** tabelas clientes e projetos do MySQL, restritas ao usuário autenticado. A consulta usa LEFT JOIN para incluir clientes com zero projetos e faz a contagem de toda a carteira, independentemente da paginação das listagens. Não usa nome, CPF ou e-mail de usuários na análise.

**Unidade de análise:** um cliente. **Variável:** quantidade de projetos por cliente, quantitativa discreta. **População:** todos os clientes da conta no instante da consulta. Não é uma pesquisa amostral.

### Gráficos

1. Barras horizontais: comparação das quantidades por cliente, com origem em zero. Mostra até dez clientes, ordenados por volume. A tabela abaixo contém a base completa e os cálculos usam todos os clientes.
2. Histograma: distribuição da quantidade de projetos, até seis intervalos de mesma largura, a partir de zero. Eixo horizontal: projetos por cliente. Eixo vertical: número de clientes.

A rubrica pede gráficos adequados ao objetivo, não um gráfico de cada tipo indiscriminadamente. Séries temporais exigem datas; regressão e dispersão exigem variáveis com uma pergunta de associação. Esta etapa não coleta esses dados, por isso esses gráficos não foram inventados.

### Métricas

Se x é a quantidade de projetos de um cliente e N é o número de clientes:

| Métrica | Cálculo | Uso |
|---|---|---|
| Total de clientes | N | Tamanho da carteira |
| Total de projetos | Soma de x | Volume cadastrado |
| Clientes com/sem projetos | Contagem de x > 0 / x = 0 | Acompanhamento comercial |
| Média | Soma de x / N | Volume médio por cliente |
| Mediana | Centro dos valores ordenados; média dos centrais se N for par | Volume central, menos influenciado pelos extremos |
| Desvio padrão populacional | Raiz de [soma de (x - média)² / N] | Dispersão da carteira |
| Maior participação | Maior x / soma de x × 100 | Concentração em volume |

Não arredondamos os dados antes dos cálculos; a interface apresenta até duas casas decimais. Sem clientes, média, mediana e desvio ficam sem dados. Com clientes e nenhum projeto, esses três valores são zero e a participação fica sem dados, pois seu denominador seria zero.

### Exemplo para a defesa

Base didática simulada: cinco clientes com 0, 1, 2, 3 e 4 projetos. Total 10, média 2, mediana 2. Soma dos desvios ao quadrado: 4 + 1 + 0 + 1 + 4 = 10. Variância populacional: 10/5 = 2. Desvio padrão: raiz de 2, aproximadamente 1,41. O maior cliente reúne 4/10 = 40% dos projetos. Um cliente está sem projetos.

**Interpretação:** há diferença de volume entre clientes e concentração de 40% em um deles. O cliente sem projetos pode receber acompanhamento comercial. A análise não comprova renda, lucratividade, horas, satisfação ou causa de diferenças. Não extrapola para o mercado e não mede evolução no tempo.

## Tech Forge: encapsulamento e acesso controlado

- Entity protege o registro com estado private readonly, inicializa o nome normalizado e devolve cópias por toRecord().
- PortfolioAnalysis usa #clients, campo privado nativo do JavaScript. O construtor valida identificadores, nomes e contagens, copia a entrada e congela os registros internos.
- Os getters totalProjects, mean, median e populationStdDev executam transformações e cálculos úteis à análise. Não são simples atalhos para expor um atributo.
- Não há setters porque indicadores derivados não devem ser escritos diretamente. Alterações da carteira passam pelos serviços e repositórios; uma consulta constrói uma nova análise.
- toReport() devolve novas cópias. Alterar a entrada ou a resposta não altera o estado interno.
- StatisticsService recebe um contrato de repositório; a produção usa MysqlStatisticsRepository. SQL não fica nos componentes ou rotas.
- Os testes verificam os resultados e tentativas de modificação da entrada e saída, além da rejeição de estados inválidos.

## Roteiro de apresentação

1. Abra /cadastro e demonstre campos obrigatórios, CPF inválido, senha fraca e confirmação diferente.
2. Cadastre com dados de teste válidos e confirme o retorno ao login.
3. Repita um cadastro para demonstrar conflito de e-mail/CPF.
4. Entre, crie os cinco clientes simulados e os projetos do exemplo.
5. Abra Estatísticas, explique fonte, unidade, gráficos, média, mediana, desvio e limitações.
6. Mostre PortfolioAnalysis e explique os campos privados, o construtor e os getters.
7. Rode npm test e npm run verify:sprint; diferencie testes em memória da integração real.
8. Mostre docker compose ps e a porta 8080. Reinicie os serviços e confirme que os dados permanecem.

O arquivo de entrega deve conter os nomes completos e o link do repositório. Após revisar as alterações, envie a versão final ao GitHub e confira o acesso do professor.
