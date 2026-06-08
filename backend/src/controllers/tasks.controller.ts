import { Request, Response, NextFunction } from "express";
import { tasksService } from "../services/tasks.service";
import { getAuthenticatedUser } from "../config/keycloak";
import { ApiSuccessResponse } from "../types";

export class TasksController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthenticatedUser(req)!;
      const result: any = await tasksService.findAll(
        req.query as any,
        user.sub,
        user.realm_access?.roles?.[0] ?? "USER",
      );
      const response: ApiSuccessResponse<any> = {
        success: true,
        data: result.data,
        meta: result.meta,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await tasksService.findById(req.params.id);
      const response: ApiSuccessResponse<any> = { success: true, data: task };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthenticatedUser(req)!;
      const task = await tasksService.create(req.body, user.sub);
      const response: ApiSuccessResponse<any> = { success: true, data: task };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthenticatedUser(req)!;
      const task = await tasksService.update(req.params.id, req.body, user.sub);
      const response: ApiSuccessResponse<any> = { success: true, data: task };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await tasksService.delete(req.params.id);
      res.json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthenticatedUser(req)!;
      const comment = await tasksService.addComment(
        req.params.id,
        req.body.content,
        user.sub,
      );
      const response: ApiSuccessResponse<any> = {
        success: true,
        data: comment,
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export const tasksController = new TasksController();
