import { Request } from "express";

const KEYCLOAK_URL = process.env.KEYCLOAK_URL ?? "http://localhost:8080";
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? "task-manager";
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID ?? "task-app";
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET ?? "";

export const keycloakConfig = {
  realm: KEYCLOAK_REALM,
  "auth-server-url": `${KEYCLOAK_URL}`,
  "ssl-required": "external",
  resource: KEYCLOAK_CLIENT_ID,
  credentials: {
    secret: KEYCLOAK_CLIENT_SECRET,
  },
  "confidential-port": 0,
  "bearer-only": true,
};

export interface AuthenticatedUser {
  sub: string;
  email: string;
  preferred_username: string;
  realm_access?: {
    roles: string[];
  };
}

export function getAuthenticatedUser(req: Request): AuthenticatedUser | null {
  const user = (req as any).kauth?.grant?.access_token?.content;
  return user ?? null;
}
