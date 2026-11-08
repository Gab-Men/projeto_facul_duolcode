// Installs the AI-agent guardrails: copies .agents/claude-settings.json to .claude/settings.json
// (deny rules + PreToolUse hook .agents/hooks/protect-secrets.ts). Safe to run more than once.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync(".claude", { recursive: true });
copyFileSync(".agents/claude-settings.json", ".claude/settings.json");
console.log("Guardrails instalados em .claude/settings.json. Confira com: npm run verify:agents");
