import type { UserRole } from "../user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string; role: UserRole };
      auth?: { userId: string; sessionId?: string };
    }
  }
}
export {};
