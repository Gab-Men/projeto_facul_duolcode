# Melhorias da interface e Tech Forge

Projeto de Gabriel Barreto Men e Pedro Henrique Rossato.
https://github.com/Gab-Men/projeto_facul_duolcode

## Alterações

Login e cadastro: composição em duas colunas no desktop e uma no celular; requisitos de senha durante a digitação; mostrar/ocultar senhas. Validações e redirecionamento preservados.

Painel: apresentação, atalhos, ícones, avatar e navegação ativa nas subrotas. Formulários, perfil e tabelas recebem os estilos compartilhados.

Estatísticas: cards, gráficos e metodologia reestilizados; indicador de proporção de clientes com projetos. Dados reais, sem preenchimento fictício. A proporção não representa conversão nem faturamento.

Tech Forge: Entity usa #state nativo congelado e devolve cópias. PortfolioAnalysis mantém #clients privado e getters de cálculo. Endpoints inalterados.

## Integração

Faça um commit ou cópia das alterações locais antes de integrar. Compare especialmente os arquivos do back-end com o trabalho do Gabriel. O pacote contém o projeto completo sem credenciais, dependências instaladas ou banco. Para aplicar só as mudanças, use melhorias.patch na raiz de uma cópia compatível: git apply --check melhorias.patch e depois git apply melhorias.patch. Não aplique o patch sobre o ZIP já atualizado.

Use npm --prefix frontend ci e npm --prefix backend ci. Siga docs/DOCKER.md para execução; o Compose exige o volume externo projeto_facul_duolcode_mysql_data. Preserve o volume existente.

## Verificação e limites

Frontend e backend compilaram. Testes executados com node --import tsx --test tests/*.test.ts dentro de backend, pois o comando convencional do tsx encontra uma restrição de IPC neste ambiente. Conferência visual e integração com MySQL pendentes: o navegador não está instalado neste ambiente.

Antes da entrega, conferir cadastro, login, erros, requisitos de senha, navegação, formulários, gráficos e perfil no computador e no celular. Testar carteira vazia, clientes sem projetos, sessão expirada e saída. Não declarar essa conferência concluída antes de executá-la.

O PDF de entrega anterior não foi atualizado.
