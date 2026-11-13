// UserPromptSubmit: regista o pedido no diário e deixa um lembrete curto do modo sénior.
const c = require("./common");
const m = require("./memory");
if (c.off) process.exit(0);
try { m.addPrompt(c.input); } catch {}

const titles = c.ruleTitles();
console.log("Modo sénior ativo: investiga primeiro, depois a solução mínima que funciona." +
  (titles.length ? ` Regras em vigor: ${titles.join("; ")}.` : ""));
