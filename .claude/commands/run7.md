---
description: Etapa 2 — executa um plano já aprovado de docs/plans/
argument-hint: <id (ex. 003) ou slug do plano>
---

Você está na **Etapa 2 (Execução)** do fluxo de duas etapas do Pipoca Gym.

Plano a executar: **$ARGUMENTS**

## Passo 0 — carregue o plano

Localize o arquivo em `docs/plans/` que corresponde a `$ARGUMENTS` (por `NNN` ou por
slug) e **leia o arquivo inteiro** antes de qualquer outra coisa. Se houver mais de um
candidato, ou nenhum, pergunte ao usuário em vez de adivinhar.

O plano é a sua única fonte de verdade. Você não tem — e não precisa ter — a conversa
que o gerou.

## Regras de execução

1. **Não reabra decisão travada.** A seção "Decisões travadas" foi negociada com o
   usuário na Etapa 1. Alternativas já descartadas continuam descartadas, mesmo que
   pareçam mais rápidas.
2. **Não expanda o escopo.** O que está em "Fora" fica fora. Se notar algo que valha
   a pena e esteja fora do escopo, anote no fim e siga em frente.
3. **Siga a ordem das fases.** Ao terminar cada fase: rode `npm run build` para
   garantir que tipos e build passam, faça o commit sugerido, e marque os `[ ]` como
   `[x]` no arquivo do plano.
4. **Atualize o `status`** no frontmatter: `em-execucao` ao começar, `concluido`
   quando todos os critérios de aceite passarem.
5. **Registre divergências no Diário de execução** (seção 9), em vez de reescrever as
   seções de planejamento. O plano é o registro do que foi decidido; o diário é o
   registro do que aconteceu.

## Quando parar

Se o plano estiver errado, incompleto ou impossível a ponto de você precisar inventar
uma decisão de arquitetura para seguir: **pare e avise o usuário**, explicando o que
falta. Não improvise um redesenho — isso é trabalho da Etapa 1, e o modelo certo para
isso pode não ser o que está rodando agora.

Divergências pequenas (um nome de função, a ordem de dois passos independentes)
você resolve sozinho e anota no diário.

## Ao terminar

- Percorra os critérios de aceite um a um e confirme cada um de verdade — rodando,
  clicando, conferindo. Não marque o que não verificou.
- Reporte fielmente: o que passou, o que não passou, o que foi pulado.
- Mostre os commits criados.
