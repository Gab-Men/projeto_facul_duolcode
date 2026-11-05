import { Router } from "express";
import type { PublicUser } from "../domain/user.js";
import type { AuthService } from "../services/auth-service.js";
import { currentUser, type ApiHandler } from "./types.js";

export function userRoutes(auth: AuthService): Router {
  const router = Router();
  const get: ApiHandler<PublicUser> = (_req, res) => { res.json(currentUser(res)); };
  const update: ApiHandler<PublicUser> = async (req, res) => {
    res.json(await auth.update(currentUser(res).id, req.body));
  };
  router.get("/me", get);
  router.put("/me", update);
  return router;
}
