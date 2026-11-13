// Diário de trabalho: um ficheiro por sessão, agrupado por projeto, em ~/.claude/memory-tail/.
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const BASE = path.join(os.homedir(), ".claude", "memory-tail");
const KEEP = 50;          // sessões guardadas por projeto
const SHOW_HERE = 8;      // sessões deste projeto mostradas no arranque
const SHOW_OTHERS = 10;   // outros projetos mostrados no arranque

const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };
const writeJson = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 1)); };
const now = () => { const d = new Date(), p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };

// Raiz do projeto: a pasta com .git mais próxima, ou a pasta atual.
function projectRoot(cwd) {
  for (let d = path.resolve(cwd); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, ".git"))) return d;
    if (path.dirname(d) === d) return path.resolve(cwd);
  }
}
function projectDir(root) {
  const name = path.basename(root) || "raiz";
  const id = name.replace(/[^\w.-]/g, "_") + "-" + crypto.createHash("sha1").update(root.toLowerCase()).digest("hex").slice(0, 6);
  return { name, dir: path.join(BASE, id) };
}

function update(input, fn) {
  if (!input.session_id || !input.cwd) return;
  const root = projectRoot(input.cwd);
  const { name, dir } = projectDir(root);
  const file = path.join(dir, `${input.session_id}.json`);
  const s = readJson(file) || { inicio: now(), pedidos: [], ficheiros: [], resultado: "" };
  fn(s, root);
  if (!s.pedidos.length) return; // sessões sem pedidos não interessam
  s.atualizado = now();
  writeJson(path.join(dir, "projeto.json"), { nome: name, caminho: root });
  writeJson(file, s);
  prune(dir);
}

const sessionsOf = (dir) => {
  try {
    return fs.readdirSync(dir).filter((f) => f !== "projeto.json" && f.endsWith(".json"))
      .map((f) => ({ f: path.join(dir, f), t: fs.statSync(path.join(dir, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t);
  } catch { return []; }
};
const prune = (dir) => sessionsOf(dir).slice(KEEP).forEach((x) => { try { fs.unlinkSync(x.f); } catch {} });

const addPrompt = (input) => update(input, (s) => {
  const p = String(input.prompt || "").replace(/<pasted_content[\s\S]*?<\/pasted_content[^>]*>/g, "[texto colado]");
  if (p.trim()) s.pedidos.push(clip(p, 160));
});
const addFile = (input) => update(input, (s, root) => {
  const f = input.tool_input && (input.tool_input.file_path || input.tool_input.notebook_path);
  if (!f) return;
  const rel = path.relative(root, f).startsWith("..") ? f : path.relative(root, f);
  if (!s.ficheiros.includes(rel)) s.ficheiros.push(rel);
});
const setResult = (input) => update(input, (s) => {
  if (input.last_assistant_message) s.resultado = clip(input.last_assistant_message, 260);
});

function render(cwd) {
  const root = projectRoot(cwd);
  const { name, dir } = projectDir(root);
  const line = (s) => {
    const parts = [`- ${s.atualizado || s.inicio}`, `Pedidos: ${s.pedidos.slice(0, 4).map((p) => `"${p}"`).join(" | ")}${s.pedidos.length > 4 ? ` (+${s.pedidos.length - 4})` : ""}`];
    if (s.ficheiros.length) parts.push(`Ficheiros: ${s.ficheiros.slice(0, 8).join(", ")}${s.ficheiros.length > 8 ? ` (+${s.ficheiros.length - 8})` : ""}`);
    if (s.resultado) parts.push(`Resultado: ${s.resultado}`);
    return parts.join(" · ");
  };

  const here = sessionsOf(dir).slice(0, SHOW_HERE).map((x) => readJson(x.f)).filter(Boolean);
  let others = [];
  try {
    others = fs.readdirSync(BASE).map((d) => path.join(BASE, d)).filter((d) => d !== dir)
      .map((d) => ({ d, meta: readJson(path.join(d, "projeto.json")), last: sessionsOf(d)[0] }))
      .filter((o) => o.meta && o.last).sort((a, b) => b.last.t - a.last.t).slice(0, SHOW_OTHERS);
  } catch {}

  const out = [`# Memória de trabalho (memory-tail)`, ``, `Projeto atual: ${name} (${root})`];
  out.push(here.length ? `\nO que foi feito neste projeto, da sessão mais recente para a mais antiga:\n${here.map(line).join("\n")}` : `\nAinda não há sessões registadas neste projeto.`);
  if (others.length) {
    out.push(`\nOutros projetos em que o utilizador trabalhou recentemente:`);
    for (const o of others) {
      const s = readJson(o.last.f) || {};
      out.push(`- ${o.meta.nome} (${o.meta.caminho}) · última vez ${s.atualizado || "?"} · "${(s.pedidos || [])[0] || ""}"`);
    }
  }
  out.push(`\nO histórico completo está em ${BASE} (uma pasta por projeto, um ficheiro por sessão). Se o pedido do utilizador se ligar a trabalho de outro projeto, ou ele perguntar o que foi feito, lê esses ficheiros antes de responder. Usa esta memória quando for útil; não a resumas sem te pedirem.`);
  return out.join("\n");
}

module.exports = { addPrompt, addFile, setResult, render, BASE };
