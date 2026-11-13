# memory-tail

Plugin do Claude Code que:

1. **Põe o Claude a trabalhar como um sénior.** Ele investiga primeiro e depois faz a solução mínima, sem código desnecessário.
2. **Guarda as tuas regras** em `regras.md` e aplica-as em todos os projetos. Grava sozinho as regras novas quando as dizes.
3. **Guarda um diário de trabalho** com o que pediste, os ficheiros alterados e o resultado de cada sessão, para o Claude se lembrar do que foi feito em cada projeto.

## Instalar

Requisitos: [Claude Code](https://code.claude.com) e [Node.js](https://nodejs.org).

No Claude Code, corre um comando de cada vez:

```
/plugin marketplace add FranciscoMartins20/memory-tail
/plugin install memory-tail@memory-tail
```

Escolhe o âmbito da tua conta de utilizador, para valer em todos os projetos, e abre uma sessão nova.

Se o primeiro comando falhar por falta de chave SSH, usa:

```
/plugin marketplace add https://github.com/FranciscoMartins20/memory-tail.git
```

## Comandos

- `/memory-tail:remember <regra>` grava uma regra. O Claude também o faz sozinho quando dizes uma regra ou o corriges.
- `/memory-tail:import` traz para o memory-tail as regras que estão na memória automática do Claude Code. Usa `/memory-tail:import todos` para todos os projetos.

## Atualizar

```
/plugin marketplace update memory-tail
```

Depois atualiza o plugin no separador dos instalados em `/plugin`.

## Onde ficam os dados

Tudo fica no teu PC:
- as regras pessoais em `~/.claude/regras.md`;
- as regras de cada projeto em `.claude/regras.md`, dentro do repositório;
- o diário em `~/.claude/memory-tail/`.
