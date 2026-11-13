---
name: remember
description: Grava uma regra, convenção ou preferência de trabalho do utilizador nos ficheiros regras.md do memory-tail. Usa sempre que o utilizador afirmar uma regra ("usamos sempre X", "não quero Y", "em vez de A faz B") ou corrigir o Claude de uma forma que vale para o futuro, sem esperar que ele peça para gravar.
---
Grava esta regra:

$ARGUMENTS

Se o texto acima estiver vazio, a regra é a que o utilizador acabou de afirmar ou a correção que acabou de fazer.

**Onde:** por omissão em `~/.claude/regras.md`, as regras pessoais que valem em todos os projetos (no Windows, `%USERPROFILE%\.claude\regras.md`). Só em `.claude/regras.md` do projeto atual se a regra for claramente específica deste projeto, ou se o utilizador o disser. Cria o ficheiro e a pasta se não existirem, com o título `# Regras`.

**Formato:**

```
## <regra numa frase curta e imperativa>
Porquê: <motivo>
Exemplo: <opcional, certo vs errado>
```

O título `##` deve ser curto: é ele que aparece no lembrete de cada pedido.

**O motivo:** usa o que o utilizador disse ou o que é evidente pelo contexto. Se não houver nenhum, escreve `Porquê: a confirmar` e, no fim da resposta, pergunta numa linha qual é. Não interrompas o trabalho para perguntar.

**Duplicados:** se já existe uma regra igual ou que esta substitui, atualiza essa em vez de criar outra, e diz o que mudou.

No fim, confirma numa linha o que gravaste e onde.
