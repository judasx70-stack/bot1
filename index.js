const { spawn } = require("child_process");
const path = require("path");

const SCRIPT = path.join(__dirname, "bot.py");
const INTERPRETERS = ["python3", "python", "py"];

function tryStart(idx) {
  if (idx >= INTERPRETERS.length) {
    console.error("[index.js] Nenhum interpretador Python encontrado.");
    process.exit(1);
  }

  const bin = INTERPRETERS[idx];
  console.log(`[index.js] Iniciando bot.py com \`${bin} bot.py\`...`);

  const proc = spawn(bin, [SCRIPT], {
    cwd: __dirname,
    stdio: "inherit",
    env: process.env,
  });

  proc.on("error", (err) => {
    if (err && err.code === "ENOENT") {
      console.warn(`[index.js] \`${bin}\` não disponível, tentando próximo...`);
      tryStart(idx + 1);
    } else {
      console.error(`[index.js] Erro ao iniciar ${bin}:`, err);
      process.exit(1);
    }
  });

  proc.on("exit", (code, signal) => {
    const msg = signal
      ? `[index.js] bot.py terminou por sinal ${signal}`
      : `[index.js] bot.py terminou com código ${code}`;
    console.error(msg);
    process.exit(typeof code === "number" ? code : 1);
  });
}

tryStart(0);
