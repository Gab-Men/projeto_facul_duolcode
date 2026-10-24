# Executar o DuolCode com Docker

## Primeira execução no Windows

1. Instale o Docker Desktop com o mecanismo WSL 2 e containers Linux. Abra-o e aguarde o mecanismo iniciar.
2. Instale Node.js 22.18 ou superior para os scripts locais. As dependências da aplicação são instaladas dentro das imagens.
3. Abra o PowerShell e entre na pasta do projeto:

```powershell
cd "C:\Users\Rodrigo\Documents\Faculdade (Gabriel)\segundo semestre\segundo bimestre\projeto\projeto_facul_duolcode"
node scripts/setup-env.ts
docker compose up --build -d
docker compose ps
```

O primeiro script cria a configuração local com credenciais aleatórias, sem exibi-las. Se ela já existir, ele a preserva. Não é necessário copiar ou editar senhas para executar a aplicação.

Na primeira vez, o Docker baixa imagens e instala dependências; espere a montagem terminar. MySQL e backend devem ficar saudáveis. Frontend e Nginx devem aparecer em execução.

Abra **http://localhost:8080**. Entre em Área de gestão → Criar minha conta, preencha nome, e-mail, CPF de teste válido, senha e confirmação. Depois do cadastro, você será levado ao login.

Não existe conta padrão. A senha precisa de 8 a 128 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número.

## O que cada serviço faz

```text
Navegador → localhost:8080 → Nginx
                              ├─ páginas → frontend (Next.js)
                              └─ /api/   → backend (Express)
                                               └─ MySQL
```

Somente o Nginx publica a porta 8080. O MySQL fica na rede interna de dados e grava no volume mysql_data. O frontend e a API são executados por usuários sem privilégios de administrador nos containers.

## Usar as estatísticas

Depois de entrar, cadastre clientes e projetos vinculados a eles. Abra **Estatísticas** no menu do painel. O botão Atualizar análise consulta novamente os dados.

Para uma demonstração reproduzível, use nomes claramente identificados como simulados e crie cinco clientes com, respectivamente, 0, 1, 2, 3 e 4 projetos. Os resultados serão: 5 clientes, 10 projetos, média 2, mediana 2, desvio padrão populacional aproximadamente 1,41 e maior participação 40%. Essa é uma sugestão didática, não uma base de clientes reais.

## Conferir a integração automaticamente

Com os serviços em execução, na raiz do projeto:

```powershell
npm run verify:sprint
```

O script testa a API real através do Nginx, incluindo validações, duplicidade de CPF/e-mail no MySQL, cálculos estatísticos e isolamento entre contas. Ele cria duas contas isoladas com dados simulados e as mantém no banco. Não imprime senhas, tokens ou CPF. Não verifica aparência ou interação dos formulários; use também o roteiro manual.

## Parar, voltar e atualizar

```powershell
docker compose stop
docker compose start
```

Esses comandos param e retomam os containers. Os registros permanecem no volume. Para aplicar alterações de código:

```powershell
docker compose up --build -d
```

Também é possível encerrar o conjunto com `docker compose down` e recriá-lo com `docker compose up -d`. **Não use a opção -v:** ela remove o volume do banco. Não apague o volume para atualizar o esquema.

## Diagnóstico

| Sintoma | Como resolver |
|---|---|
| Erro dockerDesktopLinuxEngine / cannot connect | Abra o Docker Desktop e aguarde o mecanismo; tente novamente |
| Porta 8080 ocupada | Pare o outro serviço que usa essa porta ou altere apenas a porta publicada do Nginx no Compose |
| MySQL ainda não saudável | Aguarde a inicialização e consulte `docker compose ps` |
| Página abre, mas cadastro falha | Confira a saúde da API em http://localhost:8080/api/health e consulte os logs do backend |
| Alteração não aparece | Reconstrua com `docker compose up --build -d`; o ambiente usa compilação de produção |
| Não há gráficos | Cadastre clientes e projetos na mesma conta; não há dados fictícios automáticos |

Para examinar mensagens dos serviços:

```powershell
docker compose logs --tail=60 backend frontend nginx
```

Não publique o arquivo .env nem execute comandos que mostrem a configuração do Compose com as credenciais interpoladas.
