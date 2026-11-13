---
name: import
description: Importa para o memory-tail as regras e preferências que estão na memória automática nativa do Claude Code, para ficarem num só sítio e valerem em todos os projetos.
disable-model-invocation: true
---
Importa para o memory-tail as regras que estão hoje na memória automática do Claude Code.

Âmbito: $ARGUMENTS
(vazio = só o projeto atual; "todos" = a memória automática de todos os projetos, em `~/.claude/projects/*/memory/`)

1. Lê os ficheiros da memória automática do âmbito pedido: o `MEMORY.md` e os ficheiros de cada memória. Para o projeto atual, é a pasta de memória que o Claude Code usa nesta sessão.
2. Separa o que são **regras ou preferências de trabalho** (memórias do tipo `feedback` ou `user`: como escrever código, estilo, ferramentas, idioma, o que evitar) do que são **factos do projeto** (tipos `project` e `reference`: decisões, prazos, onde encontrar coisas). Só as regras são importadas.
3. Para cada regra, decide se vale para todos os projetos (vai para `~/.claude/regras.md`) ou só para aquele projeto (vai para `.claude/regras.md` desse projeto). Na dúvida, pessoal.
4. Grava-as no formato da skill `memory-tail:remember` (título `##` curto, `Porquê:`, exemplo opcional), sem duplicar regras que já lá estejam.
5. Mostra ao utilizador uma tabela curta: regra, para onde foi, de que projeto veio.
6. Pergunta se quer apagar essas regras da memória automática, para não ficarem em dois sítios. Só apagues depois de ele confirmar, e nesse caso atualiza também o `MEMORY.md` correspondente.
