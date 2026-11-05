import { Router } from "express";
import { z } from "zod";
import { resourceNames, type BusinessRecord } from "../domain/records.js";
import type { Page } from "../domain/pagination.js";
import type { RecordService } from "../services/record-service.js";
import { currentUser, type ApiHandler } from "./types.js";

const idSchema = z.coerce.number().int().positive();
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().max(100000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

export function recordRoutes(records: RecordService): Router {
  const router = Router();
  for (const resource of resourceNames) {
    const path = `/${resource}`;
    const list: ApiHandler<Page<BusinessRecord>> = async (req, res) => {
      const { page, pageSize } = paginationSchema.parse(req.query);
      res.json(await records.list(resource, currentUser(res).id, page, pageSize));
    };
    const get: ApiHandler<BusinessRecord> = async (req, res) => {
      res.json(await records.get(resource, currentUser(res).id, idSchema.parse(req.params["id"])));
    };
    const create: ApiHandler<BusinessRecord> = async (req, res) => {
      res.status(201).json(await records.save(resource, currentUser(res).id, req.body));
    };
    const update: ApiHandler<BusinessRecord> = async (req, res) => {
      res.json(await records.save(resource, currentUser(res).id, req.body, idSchema.parse(req.params["id"])));
    };
    const remove: ApiHandler<void> = async (req, res) => {
      await records.remove(resource, currentUser(res).id, idSchema.parse(req.params["id"]));
      res.status(204).end();
    };
    router.get(path, list);
    router.get(`${path}/:id`, get);
    router.post(path, create);
    router.put(`${path}/:id`, update);
    router.delete(`${path}/:id`, remove);
  }
  return router;
}
