// PreToolUse hook: blocks any agent tool call that would read, list or print secrets.
// Exit code 2 = the tool call is denied and the reason is shown to the agent.
// Works for Read/Grep/Glob/Edit (file paths) and Bash/PowerShell (commands).
// Runs with Node >= 22.18 (native TypeScript type stripping), the version required by the project.

interface HookInput {
  tool_name?: string;
  tool_input?: Record<string, unknown>;
}

const SECRET_FILE = /(^|[\s"'=:(\\/])\.env(?!\.example\b)(\.[\w-]+)?(?=$|[\s"'\\/;|&)<>*])/i;
const PRIVATE_KEY = /\.(pem|key|p12|pfx)\b|id_rsa|id_ed25519/i;
const DUMP_COMMAND: readonly RegExp[] = [
  /\bprintenv\b/i,
  /(^|[;&|]\s*)(env|set|export -p)\s*($|[;&|>])/i,
  /\bdocker(-|\s+)compose\b[^;&|]*\bconfig\b/i,
  /\bdocker\s+(inspect|exec)\b[^;&|]*\b(env|environment)\b/i,
  /\bget-childitem\s+env:|\bgci\s+env:|\bls\s+env:|\$env:/i,
  /\bprocess\.env\s*\)|JSON\.stringify\(\s*process\.env\b/i,
  /\bos\.environ\b/i,
];
// Only fields that point to files or run commands; file *contents* being written (e.g. docs
// that mention .env) are not secrets and must not be blocked.
const PATH_FIELDS = ["file_path", "path", "notebook_path", "glob", "command"] as const;

export function check(input: HookInput): string | null {
  const tool = input.tool_name ?? "";
  const args = input.tool_input ?? {};
  const text = PATH_FIELDS.map((field) => args[field])
    .filter((value): value is string => typeof value === "string")
    .join(" ");
  if (SECRET_FILE.test(text) || PRIVATE_KEY.test(text))
    return `Bloqueado (${tool}): arquivos .env e chaves privadas não podem ser lidos pelo agente. Use .env.example.`;
  const command = typeof args["command"] === "string" ? args["command"] : "";
  if (/bash|powershell|shell/i.test(tool) && DUMP_COMMAND.some((pattern) => pattern.test(command)))
    return `Bloqueado (${tool}): comandos que imprimem variáveis de ambiente ou a configuração resolvida não são permitidos.`;
  return null;
}

async function main(): Promise<void> {
  let raw = "";
  for await (const chunk of process.stdin) raw += String(chunk);
  let input: HookInput;
  try {
    input = JSON.parse(raw || "{}") as HookInput;
  } catch {
    process.stderr.write("Bloqueado: entrada do hook inválida.\n");
    process.exit(2);
  }
  const reason = check(input);
  if (reason) {
    process.stderr.write(`${reason}\n`);
    process.exit(2);
  }
  process.exit(0);
}

await main();
