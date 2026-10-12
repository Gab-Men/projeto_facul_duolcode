import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const target = fileURLToPath(new URL("../.env", import.meta.url));
const secret = () => randomBytes(32).toString("hex");
try {
  writeFileSync(
    target,
    `MYSQL_DATABASE=duolcode\nMYSQL_USER=duolcode\nMYSQL_PASSWORD=${secret()}\nMYSQL_ROOT_PASSWORD=${secret()}\nJWT_SECRET=${secret()}\n`,
    { flag: "wx", mode: 0o600 },
  );
  console.log("Configuração local criada. Nenhuma credencial foi exibida.");
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "EEXIST")
    console.log("A configuração local já existe e foi preservada.");
  else throw error;
}
