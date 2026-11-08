# Persona e conexão com o cliente

> Proposta construída a partir do próprio site e da área de gestão. A dupla deve revisar os detalhes (nome, rotina, números) para refletir as conversas reais com o cliente antes da apresentação.

## Cliente: DuolCode — estúdio digital de dois sócios

| | |
|---|---|
| **Quem é** | Gabriel e Pedro, sócios de um estúdio que cria sites institucionais, landing pages e sistemas web para pequenas e médias empresas da região (ex.: Campo Mourão – PR). |
| **Persona principal** | **Gabriel, 22 anos, sócio responsável pelo atendimento.** Fala com os clientes pelo WhatsApp, fecha projetos e acompanha as entregas. Hoje controla tudo em conversas e planilhas soltas. |
| **Objetivo** | Saber, em um só lugar, quem são os clientes, quais projetos cada um tem, quais serviços a empresa oferece e com quais parceiros pode contar. |
| **Dores** | Informação espalhada; não sabe quais clientes estão parados (sem projeto); risco de depender de poucos clientes grandes; dados sensíveis (CPF, senhas) precisam de cuidado. |
| **Contexto de uso** | Computador no escritório e celular durante visitas; uso rápido, poucas telas, linguagem simples. |

## Como o sistema atende cada necessidade

| Necessidade da persona | Funcionalidade | Onde está |
|---|---|---|
| Apresentar a empresa e gerar contatos | Site institucional (início, serviços, quem somos, parceiros, contato com WhatsApp) | `frontend/app/*` |
| Ter uma conta própria e segura | Cadastro com CPF validado, senha forte (scrypt + salt), login com JWT | `/cadastro`, `/login`, `backend/src/services/auth-service.ts` |
| Manter os dados pessoais atualizados sem perder o acesso | Edição do perfil; e-mail fixo como identificador | `/painel/perfil` |
| Organizar a carteira | CRUD de **clientes** e **projetos** (projeto sempre vinculado a um cliente) | `/painel/clientes`, `/painel/projetos` |
| Padronizar o que vende | CRUD de **serviços** | `/painel/servicos` |
| Lembrar com quem pode contar | CRUD de **parceiros** com site | `/painel/parceiros` |
| Decidir onde investir esforço comercial | Estatísticas: clientes sem projetos, concentração (Pareto, top 20%), dispersão (desvio padrão, CV, quartis) | `/painel/estatisticas` |
| Não misturar dados de contas diferentes | Todo registro pertence ao usuário autenticado (ownerId do token) | `backend/src/repositories/mysql/*` |

## Perguntas de negócio respondidas pela análise

1. **Quantos clientes estão sem nenhum projeto?** → "Relacionamentos em movimento" e histograma (barra do zero). Ação: contato comercial.
2. **A carteira depende de poucos clientes?** → Gráfico de Pareto, maior participação e top 20%. Se ≥ 80%, risco de dependência.
3. **Os volumes são parecidos entre clientes?** → Desvio padrão, coeficiente de variação e quartis.

## Roteiro de defesa (1 minuto)

"Nosso cliente é a própria DuolCode: dois sócios que precisavam sair das planilhas. O site público atrai contatos; a área de gestão organiza clientes, serviços, parceiros e projetos; e a página de estatísticas mostra quais clientes estão parados e se a carteira está concentrada em poucos clientes — duas decisões que o Gabriel toma toda semana."
