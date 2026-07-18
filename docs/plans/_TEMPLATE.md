---
id: NNN
titulo: <título curto da feature>
status: planejado        # planejado | em-execucao | concluido
criado: AAAA-MM-DD
modelo_planejamento: <modelo usado na Etapa 1>
---

# NNN — <título>

## 1. Contexto e problema

<O que o usuário pediu, em palavras próprias. Por que isso é necessário agora.
Qual é o estado atual do código nessa área — com caminhos de arquivo reais.>

## 2. Análise crítica

> Esta seção é a razão de existir da Etapa 1. Não pule.

**Ambiguidades encontradas e como foram resolvidas:**
- <ambiguidade> → <resolução, e se veio do usuário ou de julgamento próprio>

**Riscos e armadilhas:**
- <risco> → <mitigação>

**Alternativas consideradas e descartadas:**
- <alternativa> → descartada porque <motivo>

**Suposições que a Etapa 2 deve assumir como verdadeiras:**
- <suposição>

## 3. Decisões travadas

Decisões que a Etapa 2 **não deve reabrir nem renegociar**:

- <decisão> — <justificativa em uma linha>

## 4. Escopo

**Dentro:**
- <item>

**Fora (não fazer, mesmo que pareça natural):**
- <item>

## 5. Arquivos afetados

| Arquivo | Ação | O que muda |
|---|---|---|
| `src/...` | criar / editar / remover | <resumo> |

## 6. Passos de execução

Fases independentes, cada uma com um commit ao final. Marque `[x]` conforme concluir.

### Fase 1 — <nome>
- [ ] <passo concreto, com arquivo e comportamento esperado>
- [ ] <passo>
- [ ] Commit: `<tipo>: <mensagem sugerida>`

### Fase 2 — <nome>
- [ ] <passo>
- [ ] Commit: `<tipo>: <mensagem sugerida>`

## 7. Critérios de aceite

Verificáveis, não subjetivos. A Etapa 2 só termina quando todos passarem.

- [ ] <critério observável>
- [ ] `npm run build` passa sem erro de tipo

## 8. Como verificar

<Passos concretos no app rodando: qual rota abrir, o que clicar, o que deve aparecer.
Se houver mudança de dados, qual query/tabela conferir no Supabase.>

## 9. Diário de execução

> Preenchido pela Etapa 2. Se algo divergir do plano, registre aqui em vez de reescrever as seções acima.

- <data> — <o que foi feito, o que divergiu e por quê>
