import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { getAuthenticatedUser } from "../config/keycloak";

// ✅ TEMPORARY: Allow all requests for development
// Remove this when Keycloak is properly configured
const BYPASS_AUTH = process.env.BYPASS_AUTH === "true";

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (BYPASS_AUTH) {
    // Add a mock user for development
    (req as any).kauth = {
      grant: {
        access_token: {
          content: {
            sub: "dev-user-123",
            email: "dev@example.com",
            preferred_username: "devuser",
            realm_access: { roles: ["ADMIN"] },
          },
        },
      },
    };
    return next();
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    throw ApiError.unauthorized("Authentication required");
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (BYPASS_AUTH) return next();

    const user = getAuthenticatedUser(req);
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const userRoles = user.realm_access?.roles ?? [];
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw ApiError.forbidden(`Requires one of roles: ${roles.join(", ")}`);
    }
    next();
  };
}
