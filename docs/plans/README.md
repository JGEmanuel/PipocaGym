# Planos de features

Toda feature nova, recurso ou tarefa complexa do Pipoca Gym passa por **duas etapas**,
em sessões separadas do Claude Code, com modelos diferentes.

| | Etapa 1 — Planejamento | Etapa 2 — Execução |
|---|---|---|
| Comando | `/planejar <descrição>` | `/executar <id ou slug>` |
| Modelo | avançado (ex.: Opus) | objetivo e barato (ex.: Sonnet/Haiku) |
| Entregável | arquivo em `docs/plans/` | código funcionando + commits |
| Escreve código? | **não** | sim |

## Convenção de arquivos

- Um arquivo por plano: `docs/plans/NNN-slug-em-kebab-case.md`
- `NNN` é sequencial com 3 dígitos (`001`, `002`, …), nunca reaproveitado.
- Base obrigatória: [`_TEMPLATE.md`](_TEMPLATE.md).
- O campo `status` no frontmatter é a fonte da verdade:
  `planejado` → `em-execucao` → `concluido`.

## Contrato de handoff

A Etapa 2 começa numa sessão **nova e sem memória da conversa de planejamento**.
Por isso vale a regra dura:

> **Se não está no arquivo do plano, não existe.**

O plano precisa ser autossuficiente: caminhos de arquivo reais, decisões já tomadas,
critérios de aceite verificáveis. Nada de "conforme conversamos" ou "como discutido acima".

Em troca, a Etapa 2 tem uma obrigação simétrica: **não reabrir decisão travada**.
Se o plano estiver errado ou incompleto a ponto de travar a execução, ela para e avisa —
não improvisa um redesenho.

## Fluxo prático no Claude Code Desktop

1. Sessão A, modelo avançado → `/planejar quero marcar exercício como concluído`
   Ao final existe `docs/plans/003-marcar-exercicio-concluido.md` commitado.
2. **Nova sessão** (`/clear` ou aba nova), trocar o modelo para o mais barato →
   `/executar 003`
3. Se a execução parar no meio, é só rodar `/executar 003` de novo: os checkboxes
   marcados no plano dizem onde retomar.

> Dá para fixar o modelo por comando, adicionando `model: opus` ou `model: sonnet`
> no frontmatter de `.claude/commands/planejar.md` / `executar.md`. Está desligado
> de propósito — a escolha do modelo é manual.
