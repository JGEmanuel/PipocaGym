---
description: Etapa 1 — analisa criticamente uma solicitação e grava o plano em docs/plans/
argument-hint: <descrição da feature ou tarefa>
allowed-tools: Read, Grep, Glob, Write, Bash(git log:*), Bash(git status), Bash(ls:*)
---

Você está na **Etapa 1 (Planejamento)** do fluxo de duas etapas do Pipoca Gym.

Solicitação do usuário: **$ARGUMENTS**

## Regra absoluta

**Você não escreve nem edita código de produção nesta etapa.** A única escrita
permitida é o arquivo do plano em `docs/plans/`. Se a vontade de "já corrigir isso
rapidinho" aparecer, registre como passo no plano.

## O que fazer

### 1. Investigue antes de opinar
Leia o código que a solicitação toca — de verdade, não por suposição. Identifique
os arquivos reais em `src/`, os padrões já usados no projeto (React Query, Supabase,
Tailwind v4, rotas do react-router) e como features parecidas foram resolvidas antes.
Confira `docs/plans/` para planos anteriores relacionados e leia a memória do projeto
se ela apontar decisões travadas.

### 2. Seja crítico, não complacente
Este é o valor da etapa. Antes de planejar, questione:
- A solicitação faz sentido como foi pedida? Se há um caminho melhor, **diga isso ao
  usuário** em vez de planejar em silêncio o que foi pedido.
- O que está ambíguo? O que tem mais de uma leitura razoável que levaria a trabalhos
  materialmente diferentes?
- O que vai quebrar? O que é irreversível (migração de dados, mudança de esquema)?
- O que parece o atalho óbvio e é armadilha?

Use `AskUserQuestion` para o que for genuinamente bloqueante — decisões que só o
usuário pode tomar. Resolva sozinho o que for julgamento de rotina e registre a
resolução no plano.

### 3. Escreva o plano
- Copie a estrutura de `docs/plans/_TEMPLATE.md`, preenchendo **todas** as seções.
- Numere com o próximo `NNN` livre em `docs/plans/`.
- Nome do arquivo: `docs/plans/NNN-slug-em-kebab-case.md`.
- Escreva em português, como o resto do projeto.

Escreva pensando que quem vai ler é **um modelo mais barato, numa sessão limpa, sem
nenhuma memória desta conversa**. Isso significa:
- Caminhos de arquivo completos e reais. Nunca "o componente de header".
- Passos concretos e ordenados, agrupados em fases com um commit por fase.
- Critérios de aceite observáveis — algo que dá para clicar ou rodar, não "ficou bom".
- Zero referência a "conforme conversamos", "como visto acima", "o que discutimos".
- Decisões já **tomadas**, não menus de opções para a Etapa 2 escolher.

### 4. Feche
Mostre ao usuário: o caminho do arquivo, um resumo curto das decisões travadas e o
comando exato para a próxima etapa (`/run7 NNN`). Lembre-o de abrir uma **sessão
nova** e trocar o modelo antes de executar.
