---
name: duolcode-interface
description: Criar ou ajustar telas e formulários da área de gestão DuolCode preservando as páginas institucionais.
---

Use `components/admin` para partes reutilizadas e `app` para rotas. Preserve a identidade verde do site e mantenha formulários simples. Use `lib/api.ts` e AuthProvider; não copie lógica de token para cada tela. Separe listagem, novo e editar. Campos obrigatórios, rótulos, estados de carregamento, mensagens de erro e sessão expirada devem funcionar. Valide CPF, e-mail e confirmação de senha no fluxo correspondente. Não transforme erros de API em sucesso visual. Rode `npm --prefix frontend run build` e confira as telas afetadas.
