import type { ApiErrorHandler } from "./types.js";
import { z } from "zod";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ApiErrorHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  if (error instanceof AppError) {
    res.status(error.status).json({ message: error.message });
    return;
  }
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (code === "ER_DUP_ENTRY") {
    res.status(409).json({ message: "E-mail ou CPF já cadastrado." });
    return;
  }
  if (code === "ER_ROW_IS_REFERENCED_2") {
    res
      .status(409)
      .json({
        message:
          "Este cliente tem projetos vinculados. Exclua ou transfira os projetos primeiro.",
      });
    return;
  }
  if (code === "ER_NO_REFERENCED_ROW_2") {
    res.status(400).json({ message: "O registro relacionado não existe mais." });
    return;
  }
  if (error instanceof SyntaxError) {
    res.status(400).json({ message: "JSON inválido." });
    return;
  }
  res.status(500).json({ message: "Não foi possível concluir. Tente novamente." });
};
