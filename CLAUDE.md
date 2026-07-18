# Pipoca Gym

App PWA de acompanhamento de treinos. React 19 + Vite 7 + TypeScript, Tailwind v4,
React Query, react-router v7, Supabase como backend.

- `npm run dev` — servidor de desenvolvimento (via `.claude/launch.json`, não pelo Bash)
- `npm run build` — gera ícones, roda `tsc --noEmit` e faz o build. **É o portão de qualidade:
  toda fase de trabalho termina com ele passando.**

Estrutura: `src/pages/` (telas por rota), `src/features/<domínio>/` (componentes e `api.ts`
por domínio), `src/components/` (compartilhados), `src/lib/` (Supabase, tipos, utilitários).

O projeto é escrito em português — código, commits e documentação.

## Fluxo obrigatório de duas etapas

Features novas, recursos e tarefas complexas são **sempre** divididas em duas etapas,
executadas em sessões separadas:

1. **Planejamento** — `/planejar <descrição>`. Análise crítica da solicitação e entrega de
   um plano autossuficiente em `docs/plans/NNN-slug.md`. **Nenhum código de produção é
   escrito nesta etapa.**
2. **Execução** — `/executar <NNN>`, em sessão nova. Implementa o plano, fase a fase,
   com commit por fase.

Se o usuário pedir uma feature ou tarefa complexa diretamente, sem usar `/planejar`,
**proponha a Etapa 1 antes de começar a codificar.** Ele pode dispensar — mas a proposta
é sua responsabilidade.

Correções pontuais, ajustes de texto, bugs de uma linha e dúvidas não precisam de plano.
O critério é: se dá para explicar a mudança inteira em uma frase e ela toca um arquivo,
faça direto.

As convenções completas do fluxo estão em [`docs/plans/README.md`](docs/plans/README.md).

## Decisões travadas

- **Redesenho visual**: existe um plano aprovado com paleta, fontes e tokens já definidos.
  Antes de mexer em qualquer coisa visual, leia-o —
  `C:\Users\jgema\.claude\plans\gere-o-plano-completo-elegant-pumpkin.md`.
- **Fontes são auto-hospedadas** em `public/fonts`. O app é PWA offline; CDN não serve.
