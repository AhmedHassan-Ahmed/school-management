import type { RequestHandler } from "express";
import * as adminService from "./admin.service";

export const listUsers: RequestHandler = async (req, res) => {
  const result = await adminService.listUsers({
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
    role: req.query.role as "admin" | "teacher" | "student" ,
    search: req.query.search as string ,
  });
  res.status(200).json({ success: true, data: result });
};

export const getUser: RequestHandler = async (req, res) => {
  const user = await adminService.getUserById(req.params.id as string);
  res.status(200).json({ success: true, data: { user } });
};


export const updateStatus: RequestHandler = async (req, res) => {
  const user = await adminService.updateUserStatus(
    req.params.id as string,
    req.body.isActive,
    req.user!.id,
  );
  res.status(200).json({ success: true, data: { user } });
};

export const deleteUser: RequestHandler = async (req, res) => {
  const result = await adminService.deleteUser(req.params.id as string, req.user!.id);
  res.status(200).json({ success: true, data: result, message: "User deleted successfully" });
};