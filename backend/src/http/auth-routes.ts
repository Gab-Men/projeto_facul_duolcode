import { Router } from "express";
import rateLimit from "express-rate-limit";
import type { AuthSession, PublicUser } from "../domain/user.js";
import type { AuthService } from "../services/auth-service.js";
import type { ApiHandler } from "./types.js";

export function authRoutes(auth: AuthService): Router {
  const router = Router();
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: { message: "Muitas tentativas. Aguarde alguns minutos." },
  });
  const register: ApiHandler<PublicUser> = async (req, res) => {
    res.status(201).json(await auth.register(req.body));
  };
  const login: ApiHandler<AuthSession> = async (req, res) => {
    res.json(await auth.login(req.body));
  };
  router.post("/register", limiter, register);
  router.post("/login", limiter, login);
  return router;
}

export function requireAuthentication(auth: AuthService): ApiHandler {
  return async (req, res, next) => {
    res.locals.user = await auth.authenticate(req.headers.authorization);
    next();
  };
}
