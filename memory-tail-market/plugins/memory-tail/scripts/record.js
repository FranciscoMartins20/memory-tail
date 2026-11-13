// PostToolUse (edições) e Stop (resumo final): atualiza o diário sem gastar tokens.
const c = require("./common");
const m = require("./memory");
if (c.off) process.exit(0);
try {
  if (c.input.hook_event_name === "PostToolUse") m.addFile(c.input);
  if (c.input.hook_event_name === "Stop") m.setResult(c.input);
} catch {}
