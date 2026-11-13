const fs = require("fs");
const path = require("path");
const os = require("os");

const off = process.env.MEMORY_TAIL === "off";
const read = (f) => { try { return fs.readFileSync(f, "utf8").trim(); } catch { return ""; } };

let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8")); } catch {}
const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

// Regras pessoais (todos os projetos) e, se existirem, regras específicas do projeto atual.
const personalFile = path.join(os.homedir(), ".claude", "regras.md");
const projectFile = path.join(cwd, ".claude", "regras.md");
const personal = () => read(personalFile);
const project = () => (path.resolve(projectFile) === path.resolve(personalFile) ? "" : read(projectFile));

const titles = (text) => text.split("\n").filter((l) => l.startsWith("## ")).map((l) => l.slice(3).trim());
const ruleTitles = () => [...titles(personal()), ...titles(project())];

module.exports = { off, input, cwd, read, personal, project, ruleTitles, root: path.join(__dirname, "..") };
