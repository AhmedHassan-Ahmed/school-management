import User from "../user/user.model";
import Session from "../auth/session.model";
import AppError from "../../error/AppError";
import type { UserRole } from "../user/user.interface";

interface ListUsersOptions {
  page: number;
  limit: number;
  role?: UserRole;
  search?: string;
}

const neededFields = "name email phone role isActive createdAt updatedAt";

export async function listUsers(filt: ListUsersOptions) {
  const { page, limit, role, search } = filt;
  const filter: Record<string, unknown> = {};

  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(neededFields)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserById(id: string) {
  const user = await User.findById(id).select(neededFields);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User was not found");
  return user;
}

export async function updateUserStatus(
  id: string,
  isActive: boolean,
  currentUserId: string,
) {
  if (id === currentUserId) {
    throw new AppError(
      400,
      "CANNOT_CHANGE_OWN_STATUS",
      "You cannot change your own account status",
    );
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive },
    { new: true, runValidators: true },
  ).select(neededFields);

  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User was not found");

  if (!isActive) {
    await Session.updateMany(
      { userId: user._id, revokedAt: null },
      { revokedAt: new Date() },
    );
  }

  return user;
}

export async function deleteUser(id: string, currentUserId: string) {
  if (id === currentUserId) {
    throw new AppError(
      400,
      "CANNOT_DELETE_OWN_ACCOUNT",
      "You cannot delete your own account",
    );
  }

  const user = await User.findById(id);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User was not found");

  await Session.updateMany(
    { userId: user._id, revokedAt: null },
    { revokedAt: new Date() },
  );
  await user.deleteOne();
  return { id: String(user._id) };
}
