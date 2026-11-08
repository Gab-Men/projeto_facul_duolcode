// Verifies the technical guardrail that stops AI agents from reading secrets.
// Usage: npm run verify:agents  (does not read .env; only simulates tool calls)
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const hook = ".agents/hooks/protect-secrets.ts";
interface Case { tool: string; input: Record<string, string>; blocked: boolean }
const cases: Case[] = [
  { tool: "Read", input: { file_path: "C:/projeto/.env" }, blocked: true },
  { tool: "Read", input: { file_path: "/app/backend/.env.production" }, blocked: true },
  { tool: "Grep", input: { pattern: "JWT", path: ".env" }, blocked: true },
  { tool: "Bash", input: { command: "cat .env" }, blocked: true },
  { tool: "Bash", input: { command: "type .env.local" }, blocked: true },
  { tool: "Bash", input: { command: "printenv" }, blocked: true },
  { tool: "Bash", input: { command: "docker compose config" }, blocked: true },
  { tool: "PowerShell", input: { command: "Get-ChildItem env:" }, blocked: true },
  { tool: "Bash", input: { command: "node -e \"console.log(process.env)\"" }, blocked: true },
  { tool: "Read", input: { file_path: "certs/server.key" }, blocked: true },
  { tool: "Read", input: { file_path: ".env.example" }, blocked: false },
  { tool: "Read", input: { file_path: "backend/src/app.ts" }, blocked: false },
  { tool: "Bash", input: { command: "npm --prefix backend test" }, blocked: false },
  { tool: "Bash", input: { command: "docker compose ps" }, blocked: false },
  { tool: "Edit", input: { file_path: "docs/RUBRICA.md", new_string: "Nunca leia o .env" }, blocked: false },
];

let failures = 0;
for (const testCase of cases) {
  const result = spawnSync(process.execPath, [hook], {
    input: JSON.stringify({ tool_name: testCase.tool, tool_input: testCase.input }),
    encoding: "utf8",
  });
  const blocked = result.status === 2;
  const ok = blocked === testCase.blocked;
  if (!ok) failures++;
  console.log(`${ok ? "OK  " : "FALHA"} ${testCase.blocked ? "bloquear" : "permitir"} ${testCase.tool} ${JSON.stringify(testCase.input)}`);
}

if (!existsSync(".claude/settings.json")) {
  console.log("FALHA .claude/settings.json não existe. Execute: npm run setup:agents");
  process.exit(1);
}
const settings = JSON.parse(readFileSync(".claude/settings.json", "utf8")) as {
  permissions: { deny: string[] };
  hooks?: { PreToolUse?: { hooks: { command: string }[] }[] };
};
const hookInstalled = (settings.hooks?.PreToolUse ?? []).some((entry) =>
  entry.hooks.some((item) => item.command.includes(".agents/hooks/protect-secrets.ts")));
if (!hookInstalled) failures++;
console.log(`${hookInstalled ? "OK  " : "FALHA"} hook PreToolUse registrado em .claude/settings.json`);
const denies = settings.permissions.deny;
for (const rule of ["Read(./.env)", "Read(./**/.env)", "Bash(printenv:*)"]) {
  const ok = denies.includes(rule);
  if (!ok) failures++;
  console.log(`${ok ? "OK  " : "FALHA"} regra de permissão ${rule}`);
}
for (const file of [".cursorignore", ".aiexclude", ".codeiumignore", ".geminiignore", ".aiderignore", ".gitignore"]) {
  const ok = existsSync(file) && /^\.env$/m.test(readFileSync(file, "utf8"));
  if (!ok) failures++;
  console.log(`${ok ? "OK  " : "FALHA"} ${file} exclui .env`);
}

console.log(failures ? `\n${failures} verificação(ões) falharam.` : "\nTodas as proteções de segredos estão ativas.");
process.exit(failures ? 1 : 0);
