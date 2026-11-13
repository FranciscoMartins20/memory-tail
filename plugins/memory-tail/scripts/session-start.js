// SessionStart: carrega o modo sénior, as tuas regras pessoais e as do projeto (se houver).
const path = require("path");
const c = require("./common");
if (c.off) process.exit(0);

const personal = c.personal();
const project = c.project();
console.log(c.read(path.join(c.root, "senior.md")));
console.log(personal
  ? `\n# As tuas regras (~/.claude/regras.md, valem em todos os projetos)\n\n${personal}`
  : "\n# As tuas regras\n\nAinda não existe `~/.claude/regras.md`. Quando surgir a primeira regra ou correção que valha para o futuro, grava-a com a skill `memory-tail:remember`. Se a memória automática já tiver regras do utilizador, sugere-lhe uma vez `/memory-tail:import` para as trazer para aqui.");
if (project) console.log(`\n# Regras específicas deste projeto (.claude/regras.md)\n\n${project}`);

try { console.log("\n" + require("./memory").render(c.cwd)); } catch {}
