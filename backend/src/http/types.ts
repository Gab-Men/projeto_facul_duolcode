import type { ErrorRequestHandler, RequestHandler } from "express";
import type { ParamsDictionary, Query } from "express-serve-static-core";
import type { PublicUser } from "../domain/user.js";
import { UnauthorizedError } from "../errors/app-error.js";

export interface SessionLocals {
  user?: PublicUser;
}

// Bodies stay unknown until a service validates them; responses retain their contract.
export type ApiHandler<T = unknown> = RequestHandler<ParamsDictionary, T, unknown, Query, SessionLocals>;
export type ApiErrorHandler = ErrorRequestHandler<ParamsDictionary, { message: string }, unknown, Query, SessionLocals>;

export function currentUser(res: { locals: SessionLocals }): PublicUser {
  if (!res.locals.user) throw new UnauthorizedError();
  return res.locals.user;
}
