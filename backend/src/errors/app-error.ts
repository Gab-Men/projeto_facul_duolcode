// Base class for expected (business) errors. The HTTP layer converts any AppError into
// `{ message }` with its status; unexpected errors become a generic 500 response.
export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** 400 — the request data breaks a business rule. */
export class ValidationError extends AppError {
  constructor(message = "Dados inválidos.") {
    super(400, message);
  }
}

/** 401 — missing, invalid or expired credentials. */
export class UnauthorizedError extends AppError {
  constructor(message = "Entre na sua conta para continuar.") {
    super(401, message);
  }
}

/** 404 — the resource does not exist for the authenticated account. */
export class NotFoundError extends AppError {
  constructor(message = "Registro não encontrado.") {
    super(404, message);
  }
}

/** 409 — the operation conflicts with existing data (duplicates, linked records). */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}
