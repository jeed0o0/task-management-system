import { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service";
import { ApiSuccessResponse } from "../types";

export class UsersController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersService.findAll();
      const response: ApiSuccessResponse<any> = {
        success: true,
        data: users,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.findById(req.params.id);
      const response: ApiSuccessResponse<any> = { success: true, data: user };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.create(req.body);
      const response: ApiSuccessResponse<any> = { success: true, data: user };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.update(req.params.id, req.body);
      const response: ApiSuccessResponse<any> = { success: true, data: user };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await usersService.delete(req.params.id);
      res.json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  }
}

export const usersController = new UsersController();
